import { useRef } from "react";
import { AvatarPreviewProps } from "../types";
import { cn } from "../lib/utils";

const AvatarPreview = ({
  selections,
  shape = "circle",
}: AvatarPreviewProps) => {
  const avatarRef = useRef<HTMLDivElement>(null);

  // Determine background style based on backgroundColor option
  const getBackgroundStyle = () => {
    if (!selections.backgroundColor) {
      return { backgroundColor: "#FFF3E0" }; // Default background
    }

    if (selections.backgroundColor.type === "transparent") {
      return { backgroundColor: "transparent" };
    }

    if (
      selections.backgroundColor.type === "color" &&
      selections.backgroundColor.value
    ) {
      return { backgroundColor: selections.backgroundColor.value };
    }

    return { backgroundColor: "#FFF3E0" }; // Fallback
  };

  return (
    <div
      ref={avatarRef}
      data-avatar-container
      className={cn(
        "relative w-[200px] sm:w-[250px] md:w-[300px] aspect-square mx-auto overflow-hidden flex items-center justify-center shadow-xl",
        shape === "circle" ? "rounded-full" : "rounded-xl"
      )}
      style={getBackgroundStyle()}
    >
      {/* Checkerboard pattern for transparent backgrounds */}
      {selections.backgroundColor?.type === "transparent" && (
        <div className="absolute inset-0 bg-checkerboard z-0"></div>
      )}

      <div className="absolute inset-0 flex items-center justify-center">
        {/* Background Image (lowest layer) */}
        {selections.background && (
          <img
            src={
              new URL(
                `../assets/avatar-elements/background/${selections.background}`,
                import.meta.url
              ).href
            }
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover z-50"
          />
        )}

        {/* Outfit */}
        {selections.outfit && (
          <img
            src={
              new URL(
                `../assets/avatar-elements/outfit/${selections.outfit}`,
                import.meta.url
              ).href
            }
            alt="Outfit"
            className="absolute inset-0 w-full h-full object-contain z-10"
            style={{ transform: "translateY(10%)" }}
          />
        )}

        {/* Face (base) */}
        {selections.face && (
          <img
            src={
              new URL(
                `../assets/avatar-elements/face/${selections.face}`,
                import.meta.url
              ).href
            }
            alt="Face"
            className="absolute inset-0 w-full h-full object-contain z-20"
          />
        )}

        {/* Eyes */}
        {selections.eyes && (
          <img
            src={
              new URL(
                `../assets/avatar-elements/eyes/${selections.eyes}`,
                import.meta.url
              ).href
            }
            alt="Eyes"
            className="absolute inset-0 w-full h-full object-contain z-30"
          />
        )}

        {/* Mouth */}
        {selections.mouth && (
          <img
            src={
              new URL(
                `../assets/avatar-elements/mouth/${selections.mouth}`,
                import.meta.url
              ).href
            }
            alt="Mouth"
            className="absolute inset-0 w-full h-full object-contain z-30"
          />
        )}

        {/* Hair */}
        {selections.hair && (
          <img
            src={
              new URL(
                `../assets/avatar-elements/hair/${selections.hair}`,
                import.meta.url
              ).href
            }
            alt="Hair"
            className="absolute inset-0 w-full h-full object-contain z-40"
          />
        )}

        {/* Accessories (on top of everything) */}
        {selections.accessories && (
          <img
            src={
              new URL(
                `../assets/avatar-elements/accessories/${selections.accessories}`,
                import.meta.url
              ).href
            }
            alt="Accessories"
            className="absolute inset-0 w-full h-full object-contain z-50"
          />
        )}
      </div>
    </div>
  );
};

export default AvatarPreview;
