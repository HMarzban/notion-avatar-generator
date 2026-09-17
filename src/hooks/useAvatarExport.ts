import { toPng } from "html-to-image";
import { AvatarSelections } from "../types";
import { useAvatarContainer } from "./useAvatarContainer";
import { useBackgroundOptions } from "./useBackgroundOptions";
import {
  prepareExportContainer,
  renderFinalPng,
  downloadFile,
} from "../lib/image-export";

/**
 * Hook for avatar export functionality
 */
export const useAvatarExport = (selections: AvatarSelections) => {
  const { findAvatarContainer, isCircular } = useAvatarContainer();
  const { getBackgroundColor } = useBackgroundOptions(selections);

  const exportAsPng = async (): Promise<void> => {
    const element = findAvatarContainer();
    if (!element) {
      console.error("Could not find avatar container to export");
      return;
    }

    let tempContainer: HTMLDivElement | undefined;
    try {
      const isCircle = isCircular(element);
      const bgColor = getBackgroundColor();
      tempContainer = prepareExportContainer(element);
      const clone = tempContainer.firstChild as HTMLElement;

      // Use html-to-image to render with transparency
      const dataUrl = await toPng(clone, {
        pixelRatio: 3,
        width: 1024,
        height: 1024,
        backgroundColor: undefined, // Ensures transparency
        style: {
          margin: "0",
          padding: "0",
        },
        cacheBust: false, // Keep asset URLs compatible with the offline cache.
      });

      // Clean up DOM
      document.body.removeChild(tempContainer);

      // Create final image with proper shape and background
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Could not load the rendered avatar"));
        img.src = dataUrl;
      });

      const finalDataUrl = await renderFinalPng(img, isCircle, bgColor);
      downloadFile(finalDataUrl, "notion-avatar.png");
    } catch (error) {
      console.error("Error exporting as PNG:", error);
    } finally {
      tempContainer?.remove();
    }
  };

  const exportAsSvg = async (): Promise<void> => {
    const element = findAvatarContainer();
    if (!element) {
      console.error("Could not find avatar container to export");
      return;
    }

    let tempContainer: HTMLDivElement | undefined;
    try {
      const isCircle = isCircular(element);
      const bgColor = getBackgroundColor();

      // Generate the final output with html-to-image
      tempContainer = prepareExportContainer(element);
      const clone = tempContainer.firstChild as HTMLElement;

      // Use PNG as base and convert to SVG
      const pngDataUrl = await toPng(clone, {
        pixelRatio: 3,
        width: 1024,
        height: 1024,
        backgroundColor: bgColor || undefined,
        style: {
          margin: "0",
          padding: "0",
          borderRadius: isCircle ? "50%" : "0",
        },
        cacheBust: false, // Keep asset URLs compatible with the offline cache.
      });

      document.body.removeChild(tempContainer);

      // Create a simple SVG that embeds the PNG
      const size = 1024;
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("width", size.toString());
      svg.setAttribute("height", size.toString());
      svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
      svg.setAttribute("xmlns", svgNS);

      // Add background if not transparent
      if (bgColor) {
        if (isCircle) {
          const circle = document.createElementNS(svgNS, "circle");
          circle.setAttribute("cx", (size / 2).toString());
          circle.setAttribute("cy", (size / 2).toString());
          circle.setAttribute("r", (size / 2).toString());
          circle.setAttribute("fill", bgColor);
          svg.appendChild(circle);
        } else {
          const rect = document.createElementNS(svgNS, "rect");
          rect.setAttribute("width", size.toString());
          rect.setAttribute("height", size.toString());
          rect.setAttribute("fill", bgColor);
          svg.appendChild(rect);
        }
      }

      // Add the PNG as an image
      const svgImage = document.createElementNS(svgNS, "image");
      svgImage.setAttribute("href", pngDataUrl);
      svgImage.setAttribute("width", size.toString());
      svgImage.setAttribute("height", size.toString());
      svgImage.setAttribute("preserveAspectRatio", "xMidYMid meet");

      // Add clipping for circle shape
      if (isCircle) {
        const defs = document.createElementNS(svgNS, "defs");
        const clipPath = document.createElementNS(svgNS, "clipPath");
        clipPath.setAttribute("id", "circleClip");

        const clipCircle = document.createElementNS(svgNS, "circle");
        clipCircle.setAttribute("cx", (size / 2).toString());
        clipCircle.setAttribute("cy", (size / 2).toString());
        clipCircle.setAttribute("r", (size / 2).toString());

        clipPath.appendChild(clipCircle);
        defs.appendChild(clipPath);
        svg.appendChild(defs);

        svgImage.setAttribute("clip-path", "url(#circleClip)");
      }

      svg.appendChild(svgImage);

      // Serialize the SVG
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const svgData =
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);

      downloadFile(svgData, "notion-avatar.svg");
    } catch (error) {
      console.error("Error exporting as SVG:", error);
    } finally {
      tempContainer?.remove();
    }
  };

  return { exportAsPng, exportAsSvg };
};
