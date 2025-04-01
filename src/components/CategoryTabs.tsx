import { CategoryType } from "../types";
import { TabsList, TabsTrigger, Tabs } from "./ui/tabs";
import {
  User,
  Scissors,
  Eye,
  Smile,
  Glasses,
  Shirt,
  Image,
} from "lucide-react";

interface CategoryTabsProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

const CategoryTabs = ({
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) => {
  // Define category icons for responsive display
  const categoryIcons = {
    face: <User className="h-3.5 w-3.5 md:h-4 md:w-4" />,
    hair: <Scissors className="h-3.5 w-3.5 md:h-4 md:w-4" />,
    eyes: <Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />,
    mouth: <Smile className="h-3.5 w-3.5 md:h-4 md:w-4" />,
    accessories: <Glasses className="h-3.5 w-3.5 md:h-4 md:w-4" />,
    outfit: <Shirt className="h-3.5 w-3.5 md:h-4 md:w-4" />,
    background: <Image className="h-3.5 w-3.5 md:h-4 md:w-4" />,
  };

  return (
    <Tabs
      defaultValue={selectedCategory}
      onValueChange={(value) => onSelectCategory(value as CategoryType)}
    >
      <TabsList className="grid grid-cols-7 w-full">
        <TabsTrigger
          value="face"
          className="flex flex-col md:flex-row items-center gap-1 px-1 md:px-2 py-1.5 text-[10px] md:text-xs"
        >
          {categoryIcons.face}
          <span className="hidden sm:inline">Face</span>
        </TabsTrigger>
        <TabsTrigger
          value="hair"
          className="flex flex-col md:flex-row items-center gap-1 px-1 md:px-2 py-1.5 text-[10px] md:text-xs"
        >
          {categoryIcons.hair}
          <span className="hidden sm:inline">Hair</span>
        </TabsTrigger>
        <TabsTrigger
          value="eyes"
          className="flex flex-col md:flex-row items-center gap-1 px-1 md:px-2 py-1.5 text-[10px] md:text-xs"
        >
          {categoryIcons.eyes}
          <span className="hidden sm:inline">Eyes</span>
        </TabsTrigger>
        <TabsTrigger
          value="mouth"
          className="flex flex-col md:flex-row items-center gap-1 px-1 md:px-2 py-1.5 text-[10px] md:text-xs"
        >
          {categoryIcons.mouth}
          <span className="hidden sm:inline">Mouth</span>
        </TabsTrigger>
        <TabsTrigger
          value="accessories"
          className="flex flex-col md:flex-row items-center gap-1 px-1 md:px-2 py-1.5 text-[10px] md:text-xs"
        >
          {categoryIcons.accessories}
          <span className="hidden sm:inline">Accessories</span>
        </TabsTrigger>
        <TabsTrigger
          value="outfit"
          className="flex flex-col md:flex-row items-center gap-1 px-1 md:px-2 py-1.5 text-[10px] md:text-xs"
        >
          {categoryIcons.outfit}
          <span className="hidden sm:inline">Outfit</span>
        </TabsTrigger>
        <TabsTrigger
          value="background"
          className="flex flex-col md:flex-row items-center gap-1 px-1 md:px-2 py-1.5 text-[10px] md:text-xs"
        >
          {categoryIcons.background}
          <span className="hidden sm:inline">Background</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default CategoryTabs;
