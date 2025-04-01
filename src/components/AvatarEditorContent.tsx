import { AvatarSelections, BackgroundOption } from "../types";
import AvatarPreview from "./AvatarPreview";
import BackgroundColorSelector from "./BackgroundColorSelector";
import ExportOptions from "./ExportOptions";
import ShapeControls from "./ShapeControls";

interface AvatarEditorContentProps {
  selections: AvatarSelections;
  previewShape: "circle" | "square";
  setPreviewShape: (shape: "circle" | "square") => void;
  generateRandomAvatar: () => void;
  updateBackgroundColor: (option: BackgroundOption) => void;
}

const AvatarEditorContent = ({
  selections,
  previewShape,
  setPreviewShape,
  generateRandomAvatar,
  updateBackgroundColor,
}: AvatarEditorContentProps) => {
  return (
    <div className="p-6 flex flex-col items-center justify-center relative bg-muted/30 mt-4">
      <ShapeControls
        previewShape={previewShape}
        setPreviewShape={setPreviewShape}
        generateRandomAvatar={generateRandomAvatar}
      />

      <div className="flex flex-col items-center">
        <AvatarPreview selections={selections} shape={previewShape} />

        <div className="mt-6 flex items-center gap-2">
          <ExportOptions selections={selections} variant="outline" />
        </div>
      </div>

      {/* Background color selector */}
      <div className="absolute top-4 right-4">
        <BackgroundColorSelector
          selectedOption={selections.backgroundColor}
          onSelectOption={updateBackgroundColor}
        />
      </div>
    </div>
  );
};

export default AvatarEditorContent;
