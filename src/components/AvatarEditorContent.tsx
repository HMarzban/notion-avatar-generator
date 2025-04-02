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
    <div className="p-3 sm:p-4 md:p-6 flex flex-col items-center justify-center relative bg-muted/30 mt-2 sm:mt-4">
      {/* Top controls row */}
      <div className="w-full flex flex-row justify-between items-center mb-3 sm:mb-4 md:mb-6">
        <ShapeControls
          previewShape={previewShape}
          setPreviewShape={setPreviewShape}
          generateRandomAvatar={generateRandomAvatar}
        />

        <BackgroundColorSelector
          selectedOption={selections.backgroundColor}
          onSelectOption={updateBackgroundColor}
        />
      </div>

      <div className="w-full flex flex-col items-center">
        <div className="w-full px-0 sm:px-4 md:px-8">
          <AvatarPreview selections={selections} shape={previewShape} />
        </div>

        <div className="mt-3 sm:mt-4 md:mt-6 flex items-center gap-2">
          <ExportOptions selections={selections} variant="outline" />
        </div>
      </div>
    </div>
  );
};

export default AvatarEditorContent;
