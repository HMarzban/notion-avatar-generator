import { useEffect, useState } from "react";
import { initAvatarAssetCaching } from "../lib/avatar-assets-cache";
import { PWARegisterOptions } from "../types";

/**
 * Custom hook to handle PWA updates
 * @returns Object containing update state and update handler
 */
export const usePWAUpdater = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateSW, setUpdateSW] = useState<
    ((reloadPage?: boolean) => Promise<void>) | null
  >(null);

  useEffect(() => {
    const registerPWAEvents = () => {
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        const registerSW = window.__PWA_REGISTER_SW;

        if (registerSW) {
          const options: PWARegisterOptions = {
            immediate: true,
            onOfflineReady() {
              console.log("App is ready for offline use");

              // Initialize asset caching once the service worker is ready
              initAvatarAssetCaching()
                .then(() => {
                  console.log("Avatar assets cached successfully");
                })
                .catch(console.error);
            },
            onNeedRefresh() {
              setNeedRefresh(true);
            },
          };

          const updateSWFunc = registerSW(options);
          setUpdateSW(() => updateSWFunc);
        }
      }
    };

    registerPWAEvents();
  }, []);

  return { needRefresh, updateSW };
};
