import { ExportOptionsProps } from "../types";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { useAvatarExport } from "../hooks";

/**
 * Extended props interface adding UI-specific options
 */
interface ExtendedExportOptionsProps extends ExportOptionsProps {
  variant?: "default" | "outline";
  isGrouped?: boolean;
}

/**
 * Component for rendering export options buttons
 */
const ExportOptions = ({
  selections,
  variant = "outline",
  isGrouped = false,
}: ExtendedExportOptionsProps) => {
  const { exportAsPng, exportAsSvg } = useAvatarExport(selections);

  /**
   * Export buttons component
   */
  const ExportButtons = () => (
    <>
      <Button
        onClick={exportAsPng}
        variant={variant}
        className="px-4 py-2 font-medium"
        aria-label="Export as PNG"
      >
        PNG
      </Button>
      <Button
        onClick={exportAsSvg}
        variant={variant}
        className={`px-4 py-2 font-medium ${
          isGrouped ? "rounded-l-none border-l-0" : ""
        }`}
        aria-label="Export as SVG"
      >
        SVG
      </Button>
    </>
  );

  if (isGrouped) {
    return <ExportButtons />;
  }

  return (
    <ButtonGroup>
      <ExportButtons />
    </ButtonGroup>
  );
};

export default ExportOptions;
