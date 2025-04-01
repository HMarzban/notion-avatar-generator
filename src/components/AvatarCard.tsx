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
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <CategoryTabs
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => setSelectedCategory(category)}
        />
      </CardHeader>

      <CardContent>
        <AvatarEditorContent
          selections={selections}
          previewShape={previewShape}
          setPreviewShape={setPreviewShape}
          generateRandomAvatar={generateRandomAvatar}
          updateBackgroundColor={updateBackgroundColor}
        />
      </CardContent>

      <CardFooter className="p-6 border-t">
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
