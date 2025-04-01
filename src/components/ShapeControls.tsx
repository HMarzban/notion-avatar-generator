import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { SquareIcon, CircleIcon, RefreshCw } from "lucide-react";
import { useAvatar } from "../context/AvatarContext";

interface ShapeControlsProps {
  previewShape: "circle" | "square";
  setPreviewShape: (shape: "circle" | "square") => void;
  generateRandomAvatar: () => void;
}

const ShapeControls = ({
  previewShape,
  setPreviewShape,
  generateRandomAvatar,
}: ShapeControlsProps) => {
  const { updateSelection } = useAvatar();

  const handleSquareSelection = () => {
    setPreviewShape("square");
    // Remove background item when square shape is selected
    updateSelection("background", null);
  };

  return (
    <div className="flex flex-col items-center space-y-3 p-4 absolute top-0 left-0">
      <ButtonGroup orientation="vertical">
        <Button
          variant={previewShape === "circle" ? "default" : "outline"}
          size="icon"
          onClick={() => setPreviewShape("circle")}
          aria-label="Circle shape"
          className="h-9 w-9"
        >
          <CircleIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={previewShape === "square" ? "default" : "outline"}
          size="icon"
          onClick={handleSquareSelection}
          aria-label="Square shape"
          className="h-9 w-9"
        >
          <SquareIcon className="h-4 w-4" />
        </Button>
      </ButtonGroup>
      <Button
        variant="secondary"
        onClick={generateRandomAvatar}
        className="h-9 w-9"
        size="icon"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ShapeControls;
