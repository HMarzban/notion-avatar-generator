import { useEffect, useState } from "react";
import { isOffline, registerConnectivityListeners } from "../lib/pwa-utils";
import { refreshAvatarAssetCache } from "../lib/avatar-assets-cache";

/**
 * Custom hook to track online/offline status
 * @returns Boolean indicating if the app is offline
 */
export const useOfflineStatus = () => {
  const [offline, setOffline] = useState(isOffline());

  useEffect(() => {
    // Define callbacks
    const handleOffline = () => {
      console.log("App is now offline");
      setOffline(true);
    };

    const handleOnline = () => {
      console.log("App is back online");
      setOffline(false);
      // Refresh avatar cache when coming back online
      refreshAvatarAssetCache().catch(console.error);
    };

    // Set initial state
    setOffline(isOffline());

    // Register listeners
    const cleanup = registerConnectivityListeners(handleOffline, handleOnline);

    return cleanup;
  }, []);

  return offline;
};
