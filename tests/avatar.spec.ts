import { expect, test, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

async function exportFile(page: Page, format: "PNG" | "SVG") {
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: `Export as ${format}`, exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe(`notion-avatar.${format.toLowerCase()}`);
  const file = await download.path();
  expect(file).not.toBeNull();
  return readFile(file!);
}

async function inspectPng(page: Page, png: Buffer) {
  return page.evaluate(async (data) => {
    const image = new Image();
    image.src = data;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(image, 0, 0);
    const pixel = (x: number, y: number) => Array.from(ctx.getImageData(x, y, 1, 1).data);
    const bytes = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let opaque = 0;
    for (let i = 3; i < bytes.length; i += 4) if (bytes[i] > 0) opaque++;
    return { width: image.width, height: image.height, corner: pixel(0, 0), top: pixel(512, 12), opaque };
  }, `data:image/png;base64,${png.toString("base64")}`);
}

test.beforeEach(async ({ page }) => {
  await page.goto("./");
  await expect(page.locator("[data-avatar-container]").getByAltText("Face", { exact: true })).toBeVisible();
  await page.locator("[data-avatar-container] img").evaluateAll(async (images) => {
    await Promise.all(images.map((image) => (image as HTMLImageElement).decode()));
  });
});

test("choosing and removing a category changes the composed avatar", async ({ page }) => {
  await page.getByRole("tab", { name: "Hair", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Hair Options" })).toBeVisible();
  const choice = page.locator('img[alt$=".svg"]').first();
  const asset = await choice.getAttribute("src");
  await choice.click();
  await expect(page.locator("[data-avatar-container]").getByAltText("Hair", { exact: true })).toHaveAttribute("src", asset!);
  await page.getByRole("button", { name: "Remove", exact: true }).click();
  await expect(page.locator("[data-avatar-container]").getByAltText("Hair", { exact: true })).toHaveCount(0);
});

test("circular PNG is 1024px with transparent corners and an opaque background", async ({ page }) => {
  const result = await inspectPng(page, await exportFile(page, "PNG"));
  expect(result.width).toBe(1024);
  expect(result.height).toBe(1024);
  expect(result.corner[3]).toBe(0);
  expect(result.top).toEqual([255, 255, 255, 255]);
  expect(result.opaque).toBeGreaterThan(100_000);
  await expect(page.locator('[style*="left: -9999px"]')).toHaveCount(0);
});

test("square PNG applies the selected background and transparent exports omit the checkerboard", async ({ page }) => {
  await page.getByRole("button", { name: "Square shape" }).click();
  await page.getByRole("button", { name: "Select background color" }).click();
  await page.getByRole("button", { name: "Pastel Pink background" }).click();
  await page.keyboard.press("Escape");
  const colored = await inspectPng(page, await exportFile(page, "PNG"));
  expect(colored.corner).toEqual([255, 209, 220, 255]);

  await page.getByRole("button", { name: "Select background color" }).click();
  await page.getByRole("button", { name: "Transparent background" }).click();
  await page.keyboard.press("Escape");
  const transparent = await inspectPng(page, await exportFile(page, "PNG"));
  expect(transparent.corner[3]).toBe(0);
  expect(transparent.top[3]).toBe(0);
  expect(transparent.opaque).toBeGreaterThan(1000);
  expect(transparent.opaque).toBeLessThan(colored.opaque);
});

test("SVG discloses and contains its raster image, dimensions, and circular clip", async ({ page }) => {
  await expect(page.getByText("SVG contains a PNG image", { exact: false })).toBeVisible();
  const svg = (await exportFile(page, "SVG")).toString("utf8");
  const exported = await page.evaluate((source) => {
    const doc = new DOMParser().parseFromString(source, "image/svg+xml");
    return {
      error: !!doc.querySelector("parsererror"),
      viewBox: doc.documentElement.getAttribute("viewBox"),
      width: doc.documentElement.getAttribute("width"),
      image: doc.querySelector("image")?.getAttribute("href"),
      clip: doc.querySelector("image")?.getAttribute("clip-path"),
    };
  }, svg);
  expect(exported.error).toBe(false);
  expect(exported.viewBox).toBe("0 0 1024 1024");
  expect(exported.width).toBe("1024");
  expect(exported.image).toMatch(/^data:image\/png;base64,/);
  expect(exported.clip).toBe("url(#circleClip)");
});

test("cached production app reloads offline and still customizes and exports", async ({ page, context }) => {
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
    }
  });
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("[data-avatar-container]")).toBeVisible();
  await page.getByRole("tab", { name: "Eyes", exact: true }).click();
  await page.locator('img[alt$=".svg"]').first().click();
  const eyes = page.locator("[data-avatar-container]").getByAltText("Eyes", { exact: true });
  await expect(eyes).toBeVisible();
  await eyes.evaluate((image) => (image as HTMLImageElement).decode());
  expect((await inspectPng(page, await exportFile(page, "PNG"))).width).toBe(1024);
});

test("a failed render removes temporary elements and allows a later export", async ({ page }) => {
  await page.evaluate(() => {
    const original = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function () {
      HTMLCanvasElement.prototype.toDataURL = original;
      throw new Error("Simulated image encoding failure");
    };
  });
  const failure = page.waitForEvent("console", (message) => message.text().includes("Error exporting as PNG"));
  await page.getByRole("button", { name: "Export as PNG", exact: true }).click();
  await failure;
  await expect(page.locator('[style*="left: -9999px"]')).toHaveCount(0);
  expect((await inspectPng(page, await exportFile(page, "PNG"))).width).toBe(1024);
});
