import { useRef } from "react";
import { toPng, toSvg } from "html-to-image";
import { ExportOptionsProps } from "../types";
import { Button } from "../components/ui/button";
import { ButtonGroup } from "../components/ui/button-group";

interface ExtendedExportOptionsProps extends ExportOptionsProps {
  variant?: "default" | "outline";
  isGrouped?: boolean;
}

// Custom hook to handle avatar container operations
const useAvatarContainer = () => {
  const avatarContainerRef = useRef<HTMLDivElement | null>(null);

  const findAvatarContainer = (): HTMLDivElement | null => {
    if (!avatarContainerRef.current) {
      const container = document.querySelector(
        "[data-avatar-container]"
      ) as HTMLDivElement;
      if (container) {
        avatarContainerRef.current = container;
      }
    }
    return avatarContainerRef.current;
  };

  const isCircular = (element: HTMLElement): boolean => {
    return element.classList.contains("rounded-full");
  };

  return { findAvatarContainer, isCircular };
};

// Custom hook to handle background options
const useBackgroundOptions = (selections: ExportOptionsProps["selections"]) => {
  const getBackgroundColor = (): string | null => {
    if (!selections.backgroundColor) {
      return "#FFF3E0"; // Default background color
    }

    if (selections.backgroundColor.type === "transparent") {
      return null;
    }

    if (
      selections.backgroundColor.type === "color" &&
      selections.backgroundColor.value
    ) {
      return selections.backgroundColor.value;
    }

    return "#FFF3E0"; // Fallback
  };

  return { getBackgroundColor };
};

// Custom hook for export functionality
const useAvatarExport = (selections: ExportOptionsProps["selections"]) => {
  const { findAvatarContainer, isCircular } = useAvatarContainer();
  const { getBackgroundColor } = useBackgroundOptions(selections);

  // Helper to prepare a temporary container for export
  const prepareExportContainer = (element: HTMLElement): HTMLDivElement => {
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

  const exportAsPng = async () => {
    const element = findAvatarContainer();
    if (!element) {
      console.error("Could not find avatar container to export");
      return;
    }

    try {
      const isCircle = isCircular(element);
      const bgColor = getBackgroundColor();
      const tempContainer = prepareExportContainer(element);
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
        cacheBust: true,
      });

      // Clean up DOM
      document.body.removeChild(tempContainer);

      // Create final image with proper shape and background
      const img = new Image();
      img.src = dataUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const finalDataUrl = await renderFinalPng(img, isCircle, bgColor);
      downloadFile(finalDataUrl, "notion-avatar.png");
    } catch (error) {
      console.error("Error exporting as PNG:", error);
    }
  };

  const renderFinalPng = async (
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

  const exportAsSvg = async () => {
    const element = findAvatarContainer();
    if (!element) {
      console.error("Could not find avatar container to export");
      return;
    }

    try {
      const isCircle = isCircular(element);
      const bgColor = getBackgroundColor();
      const tempContainer = prepareExportContainer(element);
      const clone = tempContainer.firstChild as HTMLElement;

      try {
        // Create SVG with proper shape and background
        const svgData = await createCustomSvg(clone, isCircle, bgColor);
        document.body.removeChild(tempContainer);
        downloadFile(svgData, "notion-avatar.svg");
        return;
      } catch (error) {
        console.error("Error creating custom SVG:", error);

        // Fallback to standard approach
        const dataUrl = await toSvg(element, {
          pixelRatio: 3,
          width: 1024,
          height: 1024,
          style: {
            margin: "0",
            padding: "0",
            borderRadius: isCircle ? "50%" : "12px",
            overflow: "hidden",
          },
          cacheBust: true,
        });

        document.body.removeChild(tempContainer);
        downloadFile(dataUrl, "notion-avatar.svg");
      }
    } catch (error) {
      console.error("Error exporting as SVG:", error);
    }
  };

  const createCustomSvg = async (
    element: HTMLElement,
    isCircle: boolean,
    bgColor: string | null
  ): Promise<string> => {
    const size = 1024;
    const svgNS = "http://www.w3.org/2000/svg";

    // Create SVG document
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
        const background = document.createElementNS(svgNS, "rect");
        background.setAttribute("width", size.toString());
        background.setAttribute("height", size.toString());
        background.setAttribute("fill", bgColor);
        svg.appendChild(background);
      }
    }

    // Add clip path for circular avatars
    if (isCircle) {
      const defs = document.createElementNS(svgNS, "defs");
      const clipPath = document.createElementNS(svgNS, "clipPath");
      clipPath.setAttribute("id", "circleClip");

      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", (size / 2).toString());
      circle.setAttribute("cy", (size / 2).toString());
      circle.setAttribute("r", (size / 2).toString());

      clipPath.appendChild(circle);
      defs.appendChild(clipPath);
      svg.appendChild(defs);
    }

    // Add content group
    const contentGroup = document.createElementNS(svgNS, "g");
    if (isCircle) {
      contentGroup.setAttribute("clip-path", "url(#circleClip)");
    }
    svg.appendChild(contentGroup);

    // Get inner content as SVG
    const innerSvgDataUrl = await toSvg(element, {
      pixelRatio: 3,
      width: size,
      height: size,
      cacheBust: true,
    });

    // Parse inner SVG
    const parsedContainer = document.createElement("div");
    parsedContainer.innerHTML = innerSvgDataUrl;
    const innerSvg = parsedContainer.querySelector("svg");

    if (innerSvg) {
      const innerElements = innerSvg.querySelector("g");
      if (innerElements) {
        contentGroup.innerHTML = innerElements.innerHTML;
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        return (
          "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString)
        );
      }
    }

    throw new Error("Failed to extract SVG content");
  };

  const downloadFile = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  return { exportAsPng, exportAsSvg };
};

// Main component with minimal rendering logic
const ExportOptions = ({
  selections,
  variant = "outline",
  isGrouped = false,
}: ExtendedExportOptionsProps) => {
  const { exportAsPng, exportAsSvg } = useAvatarExport(selections);

  // Export buttons
  const ExportButtons = () => (
    <>
      <Button
        onClick={exportAsPng}
        variant={variant}
        className="px-4 py-2 font-medium"
        aria-label="Export as PNG"
      >
        PNG
      </Button>
      <Button
        onClick={exportAsSvg}
        variant={variant}
        className={`px-4 py-2 font-medium ${
          isGrouped ? "rounded-l-none border-l-0" : ""
        }`}
        aria-label="Export as SVG"
      >
        SVG
      </Button>
    </>
  );

  // When grouped, render just the buttons
  if (isGrouped) {
    return <ExportButtons />;
  }

  // Otherwise wrap with ButtonGroup
  return (
    <ButtonGroup>
      <ExportButtons />
    </ButtonGroup>
  );
};

export default ExportOptions;
