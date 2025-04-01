import { Button } from "./ui/button";
import { FaGithub } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

const AppHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent  dark:to-gray-400">
        Notion-Style Avatar Creator
      </h1>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            window.open(
              "https://hmarzban.github.io/notion-avatar-generator/",
              "_blank"
            )
          }
          aria-label="GitHub Repository"
        >
          <FaGithub className="h-4 w-4" />
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default AppHeader;
