import { Button } from "./ui/button";
import { FaGithub } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import { WifiOff, Download, RefreshCw } from "lucide-react";
import { usePWAInstall, useOfflineStatus, usePWAUpdater } from "../hooks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AppHeader = () => {
  const offline = useOfflineStatus();
  const { showInstall, handleInstall } = usePWAInstall();
  const { needRefresh, updateSW } = usePWAUpdater();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent dark:to-gray-400">
        Notion-Style Avatar Creator
      </h1>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          {/* Update available button */}
          {needRefresh && updateSW && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateSW(true)}
                  aria-label="Update Available"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Update Available</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Install button */}
          {showInstall && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleInstall}
                  aria-label="Install for Offline Use"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Install for Offline Use</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Offline indicator */}
          {offline && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Offline Mode"
                  disabled
                >
                  <WifiOff className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Offline Mode</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* GitHub button with tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  window.open(
                    "https://github.com/HMarzban/notion-avatar-generator",
                    "_blank"
                  )
                }
                aria-label="GitHub Repository"
              >
                <FaGithub className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>GitHub Repository</p>
            </TooltipContent>
          </Tooltip>

          {/* Theme toggle */}
          <ThemeToggle />
        </TooltipProvider>
      </div>
    </div>
  );
};

export default AppHeader;
