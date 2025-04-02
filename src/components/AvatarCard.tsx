import { useState } from "react";
import { useAvatar } from "../context/AvatarContext";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { CategoryType } from "../types";
import CategoryTabs from "./CategoryTabs";
import AvatarEditorContent from "./AvatarEditorContent";
import ItemSelector from "./ItemSelector";

const AvatarCard = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>("face");
  const {
    selections,
    updateSelection,
    updateBackgroundColor,
    previewShape,
    setPreviewShape,
    generateRandomAvatar,
  } = useAvatar();

  return (
    <Card className="overflow-hidden w-full max-w-full sm:max-w-4xl">
      <CardHeader className="pb-0 px-2 sm:px-6">
        <CategoryTabs
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => setSelectedCategory(category)}
        />
      </CardHeader>

      <CardContent className="px-2 sm:px-6">
        <AvatarEditorContent
          selections={selections}
          previewShape={previewShape}
          setPreviewShape={setPreviewShape}
          generateRandomAvatar={generateRandomAvatar}
          updateBackgroundColor={updateBackgroundColor}
        />
      </CardContent>

      <CardFooter className="p-4 sm:p-6 border-t">
        <ItemSelector
          category={selectedCategory}
          selectedItem={selections[selectedCategory]}
          onSelectItem={(item) => updateSelection(selectedCategory, item)}
        />
      </CardFooter>
    </Card>
  );
};

export default AvatarCard;
