import { CategorySelectorProps, CategoryType } from "../types";
import { FaUser, FaGlasses, FaTshirt, FaPalette } from "react-icons/fa";
import { GiHairStrands, GiEyeTarget, GiLips } from "react-icons/gi";
import { useRef, useEffect } from "react";

const categories: {
  type: CategoryType;
  label: string;
  icon: React.ReactNode;
}[] = [
  { type: "hair", label: "Top", icon: <GiHairStrands className="w-4 h-4" /> },
  { type: "face", label: "Face", icon: <FaUser className="w-4 h-4" /> },
  {
    type: "accessories",
    label: "Accessories",
    icon: <FaGlasses className="w-4 h-4" />,
  },
  {
    type: "outfit",
    label: "Clothing",
    icon: <FaTshirt className="w-4 h-4" />,
  },
  {
    type: "mouth",
    label: "Mouth",
    icon: <GiLips className="w-4 h-4" />,
  },
  { type: "eyes", label: "Eyes", icon: <GiEyeTarget className="w-4 h-4" /> },
  {
    type: "background",
    label: "Background",
    icon: <FaPalette className="w-4 h-4" />,
  },
];

const CategorySelector = ({
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedButtonRef = useRef<HTMLButtonElement>(null);

  // Scroll to the selected category button when it changes
  useEffect(() => {
    if (selectedButtonRef.current && containerRef.current) {
      selectedButtonRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }
  }, [selectedCategory]);

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500 dark:hover:scrollbar-thumb-gray-500 px-1 py-2"
    >
      <div className="flex space-x-2 min-w-max pb-1">
        {categories.map((category) => (
          <button
            key={category.type}
            ref={selectedCategory === category.type ? selectedButtonRef : null}
            className={`flex items-center px-6 py-3 rounded-full text-sm transition-colors ${
              selectedCategory === category.type
                ? "bg-teal-700 text-white font-medium"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => onSelectCategory(category.type)}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
