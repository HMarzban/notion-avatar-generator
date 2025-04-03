import { useEffect, useState } from "react";
import { BeforeInstallPromptEvent } from "../types";

/**
 * Custom hook to handle PWA installation
 * @returns Object containing installation state and installation handler
 */
export const usePWAInstall = () => {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the browser default behavior
      e.preventDefault();
      // Store the event for later use
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Show the install button
      setShowInstall(true);
    };

    // Check if already installed
    const checkIfInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setShowInstall(false);
      }
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log("App successfully installed");
      setShowInstall(false);
    };

    // Add event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    checkIfInstalled();

    // Clean up event listeners
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Handle installation
  const handleInstall = async () => {
    if (!installPrompt) return;

    // Show the install prompt
    await installPrompt.prompt();

    // Wait for user choice
    const choiceResult = await installPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the installation");
      setShowInstall(false);
    } else {
      console.log("User dismissed the installation");
    }

    // Clear the saved prompt
    setInstallPrompt(null);
  };

  return { showInstall, handleInstall };
};
