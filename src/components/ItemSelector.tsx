import { useEffect, useState } from "react";
import { ItemSelectorProps } from "../types";
import { useAvatar } from "../context/AvatarContext";
import { Button } from "./ui/button";
import { Loader2, Shuffle } from "lucide-react";
import { cn } from "../lib/utils";

const ItemSelector = ({
  category,
  selectedItem,
  onSelectItem,
}: ItemSelectorProps) => {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { selections } = useAvatar();

  useEffect(() => {
    // In a real app, we would fetch items from an API
    // For this demo, we'll simulate loading the items based on the selected category
    const loadItems = async () => {
      setLoading(true);

      // This is a placeholder for actual file loading logic
      // In a production app, you might use an API or a more structured approach
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

        setItems(filteredItems);
      } catch (error) {
        console.error(`Error loading ${category} items:`, error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [category]);

  // Function to handle removing item selection
  const handleRemoveItem = () => {
    onSelectItem(null);
  };

  // Function to select a random item
  const handleRandomItem = () => {
    if (items.length > 0) {
      const randomIndex = Math.floor(Math.random() * items.length);
      onSelectItem(items[randomIndex]);
    }
  };

  // Function to render item preview
  const renderItemPreview = (item: string) => {
    const bgColor =
      selections.backgroundColor?.type === "color"
        ? selections.backgroundColor.value
        : "#ffffff";

    return (
      <div
        key={item}
        className={cn(
          "relative flex p-1 items-center justify-center border rounded-xl cursor-pointer transition-all",
          selectedItem === item
            ? "border-primary bg-primary/10"
            : "border-border hover:border-muted-foreground/30"
        )}
        onClick={() => onSelectItem(item)}
      >
        <div
          className="flex justify-center items-center h-10 w-10 sm:h-14 sm:w-14 rounded-lg overflow-hidden"
          style={{ backgroundColor: bgColor as string }}
        >
          <img
            src={
              new URL(
                `../assets/avatar-elements/${category}/${item}`,
                import.meta.url
              ).href
            }
            alt={item}
            className="h-7 w-7 sm:h-10 sm:w-10 object-contain max-w-full m-auto"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-4 gap-2 sm:gap-0">
        <h2 className="text-base sm:text-lg font-semibold">
          {category.charAt(0).toUpperCase() + category.slice(1)} Options
        </h2>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button
            onClick={handleRandomItem}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 h-8 px-2 sm:px-3"
          >
            <Shuffle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Random</span>
          </Button>
          {selectedItem && (
            <Button
              onClick={handleRemoveItem}
              variant="ghost"
              size="sm"
              className="text-muted-foreground h-8 px-2 sm:px-3"
            >
              Remove
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-16 sm:h-24">
          <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-muted-foreground" />
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3 max-h-[140px] sm:max-h-[180px] overflow-y-auto p-1">
          {items.map(renderItemPreview)}
        </div>
      ) : (
        <div className="text-center py-4 sm:py-6 text-muted-foreground text-sm sm:text-base">
          No items available for this category
        </div>
      )}
    </div>
  );
};

export default ItemSelector;
