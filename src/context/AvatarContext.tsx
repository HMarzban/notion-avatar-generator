import { createContext, useContext, useState, ReactNode } from "react";
import { AvatarSelections, CategoryType, BackgroundOption } from "../types";

interface AvatarContextType {
  selections: AvatarSelections;
  updateSelection: (category: CategoryType, item: string | null) => void;
  updateBackgroundColor: (option: BackgroundOption) => void;
  previewShape: "square" | "circle";
  setPreviewShape: (shape: "square" | "circle") => void;
  generateRandomAvatar: () => Promise<void>;
}

const defaultSelections: AvatarSelections = {
  face: "Head=Head01.svg",
  hair: null,
  eyes: null,
  mouth: null,
  accessories: null,
  outfit: null,
  background: null,
  backgroundColor: { type: "color", value: "#fff" }, // Default background color
};

export const AvatarContext = createContext<AvatarContextType | undefined>(
  undefined
);

export const AvatarProvider = ({ children }: { children: ReactNode }) => {
  const [selections, setSelections] =
    useState<AvatarSelections>(defaultSelections);
  const [previewShape, setPreviewShape] = useState<"square" | "circle">(
    "circle"
  );

  const updateSelection = (category: CategoryType, item: string | null) => {
    setSelections((prev) => ({
      ...prev,
      [category]: item,
    }));
  };

  const updateBackgroundColor = (option: BackgroundOption) => {
    setSelections((prev) => ({
      ...prev,
      backgroundColor: option,
    }));
  };

  const generateRandomAvatar = async () => {
    // Available categories
    const categories: CategoryType[] = [
      "face",
      "hair",
      "eyes",
      "mouth",
      "accessories",
      "outfit",
    ];

    // Add background category only if previewShape is not square
    if (previewShape !== "square") {
      categories.push("background");
    } else {
      // If shape is square, explicitly set background to null
      updateSelection("background", null);
    }

    // Pastel colors for background with weights
    const colorOptions = [
      { color: "#FFD1DC", weight: 1 }, // Pastel Pink
      { color: "#AEC6CF", weight: 1 }, // Pastel Blue
      { color: "#B0E57C", weight: 1 }, // Pastel Green
      { color: "#CBC3E3", weight: 1 }, // Pastel Purple
      { color: "#FDFD96", weight: 1 }, // Pastel Yellow
      { color: "#A0E6E2", weight: 1 }, // Pastel Pastel Teal
      { color: "#FFB347", weight: 1 }, // Pastel Orange
      { color: "#FFF3E0", weight: 1 }, // Off White
      { color: "#fff", weight: 7 }, // Pure White - higher weight (7x more likely)
    ];

    // Calculate total weight
    const totalWeight = colorOptions.reduce(
      (sum, option) => sum + option.weight,
      0
    );

    // Get a random number between 0 and total weight
    const randomNum = Math.random() * totalWeight;

    // Find the color based on weights
    let weightSum = 0;
    let selectedColor = "#fff"; // Default to white if something goes wrong

    for (const option of colorOptions) {
      weightSum += option.weight;
      if (randomNum <= weightSum) {
        selectedColor = option.color;
        break;
      }
    }

    // Update background color
    updateBackgroundColor({
      type: "color",
      value: selectedColor,
    });

    // Process each category
    for (const category of categories) {
      try {
        // Import all category files dynamically
        const categoryFiles = import.meta.glob(
          "../assets/avatar-elements/**/*.svg",
          { eager: true }
        );

        // Filter files that match the current category
        const filteredItems = Object.keys(categoryFiles)
          .filter((path) => path.includes(`/avatar-elements/${category}/`))
          .map((path) => path.split(`/avatar-elements/${category}/`)[1]);

        if (filteredItems.length > 0) {
          // Always select a random item for each category
          const randomIndex = Math.floor(Math.random() * filteredItems.length);
          updateSelection(category, filteredItems[randomIndex]);
        }
      } catch (error) {
        console.error(`Error loading random ${category} item:`, error);
      }
    }
  };

  return (
    <AvatarContext.Provider
      value={{
        selections,
        updateSelection,
        updateBackgroundColor,
        previewShape,
        setPreviewShape,
        generateRandomAvatar,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (context === undefined) {
    throw new Error("useAvatar must be used within an AvatarProvider");
  }
  return context;
};
