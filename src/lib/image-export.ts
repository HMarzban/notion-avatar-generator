/**
 * Helper functions for exporting avatar images
 */

/**
 * Creates a temporary container for export
 */
export const prepareExportContainer = (
  element: HTMLElement
): HTMLDivElement => {
  const tempContainer = document.createElement("div");
  tempContainer.style.position = "absolute";
  tempContainer.style.left = "-9999px";
  tempContainer.style.top = "-9999px";
  tempContainer.style.width = "1024px";
  tempContainer.style.height = "1024px";

  // Clone the content
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = "100%";
  clone.style.height = "100%";
  clone.style.borderRadius = "0";
  clone.style.display = "flex";
  clone.style.alignItems = "center";
  clone.style.justifyContent = "center";
  clone.style.backgroundColor = "transparent";

  // Remove checkerboard pattern
  const checkerboardEl = clone.querySelector(".bg-checkerboard");
  if (checkerboardEl) {
    (checkerboardEl as HTMLElement).style.display = "none";
  }

  tempContainer.appendChild(clone);
  document.body.appendChild(tempContainer);

  return tempContainer;
};

/**
 * Renders a final PNG with proper shape and background
 */
export const renderFinalPng = async (
  img: HTMLImageElement,
  isCircle: boolean,
  bgColor: string | null
): Promise<string> => {
  const canvas = document.createElement("canvas");
  const size = 1024;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Clear canvas for transparency
  ctx.clearRect(0, 0, size, size);

  // Fill background if not transparent
  if (bgColor) {
    if (isCircle) {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = bgColor;
      ctx.fill();
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
    }
  }

  if (isCircle) {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
  }

  // Draw image centered
  ctx.drawImage(img, 0, 0, size, size);
  return canvas.toDataURL("image/png");
};

/**
 * Downloads a file from a data URL
 */
export const downloadFile = (dataUrl: string, filename: string): void => {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
};
