import { AvatarSelections } from "../types";

/**
 * Hook to handle background options
 */
export const useBackgroundOptions = (selections: AvatarSelections) => {
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
