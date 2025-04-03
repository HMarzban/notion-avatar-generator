// Utility functions for PWA functionality

// Define the Navigator type with standalone property for iOS Safari
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

/**
 * Prefetch and cache specified asset paths for offline use
 * @param paths Array of asset paths to cache
 */
export async function prefetchAssets(paths: string[]): Promise<void> {
  // Skip if not in a browser or if service worker is not supported
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  try {
    // Wait for service worker to be ready
    const registration = await navigator.serviceWorker.ready;

    // If the service worker has a cache
    if (registration.active) {
      // Fetch all paths and add them to cache
      const cacheName = "avatar-assets-cache";
      const cache = await caches.open(cacheName);

      // Create fetch promises for all paths
      const fetchPromises = paths.map(async (path) => {
        try {
          // Only cache if not already in cache
          const cacheResponse = await cache.match(path);
          if (!cacheResponse) {
            const response = await fetch(path, { mode: "no-cors" });
            if (response.ok || response.type === "opaque") {
              await cache.put(path, response);
              console.log(`Cached asset: ${path}`);
            }
          }
        } catch (error) {
          console.warn(`Failed to cache asset: ${path}`, error);
        }
      });

      // Execute all fetch promises
      await Promise.allSettled(fetchPromises);
      console.log("Finished caching avatar assets");
    }
  } catch (error) {
    console.error("Error prefetching assets:", error);
  }
}

/**
 * Check if the app is running in PWA mode (installed)
 * @returns boolean indicating if the app is running as an installed PWA
 */
export function isRunningAsPWA(): boolean {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    (window.navigator as NavigatorWithStandalone).standalone === true // iOS Safari
  );
}

/**
 * Check if the device is currently offline
 * @returns boolean indicating if the device is offline
 */
export function isOffline(): boolean {
  return typeof navigator !== "undefined" && !navigator.onLine;
}

/**
 * Register the event listeners for online/offline events
 * @param onOffline Callback for offline event
 * @param onOnline Callback for online event
 * @returns Cleanup function
 */
export function registerConnectivityListeners(
  onOffline: () => void,
  onOnline: () => void
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("offline", onOffline);
  window.addEventListener("online", onOnline);

  return () => {
    window.removeEventListener("offline", onOffline);
    window.removeEventListener("online", onOnline);
  };
}
