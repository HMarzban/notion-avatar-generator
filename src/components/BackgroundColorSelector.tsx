import { BackgroundOption } from "../types";
import { Palette, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface BackgroundColorSelectorProps {
  selectedOption: BackgroundOption;
  onSelectOption: (option: BackgroundOption) => void;
}

const BackgroundColorSelector = ({
  selectedOption,
  onSelectOption,
}: BackgroundColorSelectorProps) => {
  // Predefined pastel colors
  const pastelColors = [
    { name: "Pastel Pink", value: "#FFD1DC" },
    { name: "Pastel Blue", value: "#AEC6CF" },
    { name: "Pastel Green", value: "#B0E57C" },
    { name: "Pastel Purple", value: "#CBC3E3" },
    { name: "Pastel Yellow", value: "#FDFD96" },
    { name: "Pastel Orange", value: "#FFB347" },
    { name: "Pastel Teal", value: "#A0E6E2" },
    { name: "Off White", value: "#FFF3E0" },
    { name: "Pure White", value: "#fff" },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          aria-label="Select background color"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60" align="end">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Background</h4>
          <div className="flex flex-wrap gap-2">
            {/* Transparent option */}
            <button
              onClick={() =>
                onSelectOption({ type: "transparent", value: null })
              }
              className={cn(
                "w-8 h-8 rounded-full border border-border flex items-center justify-center",
                selectedOption.type === "transparent" &&
                  "ring-2 ring-primary ring-offset-2"
              )}
              aria-label="Transparent background"
              title="Transparent"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Color options */}
            {pastelColors.map((color) => (
              <button
                key={color.value}
                onClick={() =>
                  onSelectOption({ type: "color", value: color.value })
                }
                className={cn(
                  "w-8 h-8 rounded-full border border-border",
                  selectedOption.type === "color" &&
                    selectedOption.value === color.value &&
                    "ring-2 ring-primary ring-offset-2"
                )}
                style={{ backgroundColor: color.value }}
                aria-label={`${color.name} background`}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BackgroundColorSelector;
