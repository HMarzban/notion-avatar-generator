import { prefetchAssets } from "./pwa-utils";

// Base path to avatar assets
const BASE_PATH = "/notion-avatar-generator/assets/";

// Asset categories and their paths
const assetCategories = {
  face: "Head_",
  hair: "Hair_",
  eyes: "Eyes_",
  mouth: "Mouth_",
  accessories: "Accesories_",
  outfit: "Outfit_",
  background: "Bg",
};

/**
 * Get all avatar asset URLs from the DOM
 * This helps us identify assets that are actually used in the application
 */
function getAllAvatarAssetUrls(): string[] {
  // Only run in browser
  if (typeof document === "undefined") return [];

  // Get all SVG images from the document
  const svgElements = document.querySelectorAll('img[src*=".svg"]');
  const svgUrls = Array.from(svgElements).map(
    (el) => (el as HTMLImageElement).src
  );

  // Filter to only include avatar assets
  return svgUrls.filter((url) =>
    Object.values(assetCategories).some((prefix) => url.includes(prefix))
  );
}

/**
 * Prefetch static avatar assets based on their category patterns
 */
async function prefetchStaticAvatarAssets(): Promise<void> {
  try {
    // Build paths for all potential asset categories
    const paths: string[] = [];

    // Check if we're in the browser
    if (typeof window === "undefined") return;

    // Get the base URL for the assets, accounting for the base path
    const baseUrl = window.location.origin + BASE_PATH;

    // Add paths for potentially 30+ variations of each asset type
    // These numbers are estimates and should be adjusted based on the actual number of assets
    for (let i = 1; i <= 8; i++) {
      paths.push(`${baseUrl}Head_Head0${i}.svg`);
    }

    for (let i = 1; i <= 32; i++) {
      const num = i < 10 ? `0${i}` : i;
      paths.push(`${baseUrl}Hair_Style${num}.svg`);
    }

    // Common eye types
    const eyeTypes = ["Normal", "Closed", "Sad", "Angry", "Thin", "Cynic"];
    eyeTypes.forEach((type) => {
      paths.push(`${baseUrl}Eyes_${type}.svg`);
    });

    // Common mouth types
    const mouthTypes = [
      "Normal Smile 1",
      "Sad",
      "Hate",
      "Whistle",
      "Eat",
      "Mouth11",
      "Open Mouth",
      "Open Tooth",
      "Angry",
    ];
    mouthTypes.forEach((type) => {
      paths.push(`${baseUrl}Mouth_${type}.svg`);
    });

    // Accessories
    const accessoryTypes = [
      "Mousthace 1",
      "Mousthace 2",
      "Mousthace 4",
      "Beard 1",
      "Beard 2",
      "Beard 3",
      "Beard 4",
      "Futuristic Glasses",
      "Rounded Glasses",
      "Glasses",
      "Stylish Glasses",
      "Blush",
      "Earphone",
      "Mask",
      "Mask Google",
      "Cap",
      "Waitress Tie",
    ];
    accessoryTypes.forEach((type) => {
      paths.push(`${baseUrl}Accesories_${type}.svg`);
    });

    // Outfits
    for (let i = 1; i <= 25; i++) {
      const num = i < 10 ? `0${i}` : i;
      paths.push(`${baseUrl}Outfit_Style${num}.svg`);
    }

    // Background
    paths.push(`${baseUrl}Bg.svg`);

    // Prefetch all these static assets
    await prefetchAssets(paths);
  } catch (error) {
    console.error("Error prefetching static avatar assets:", error);
  }
}

/**
 * Initialize avatar asset caching
 * This should be called once the app is loaded and the service worker is active
 */
export async function initAvatarAssetCaching(): Promise<void> {
  // First prefetch the static list of avatar assets
  await prefetchStaticAvatarAssets();

  // Then after the app has rendered, cache actual assets found in the DOM
  setTimeout(async () => {
    const assetUrls = getAllAvatarAssetUrls();
    if (assetUrls.length > 0) {
      await prefetchAssets(assetUrls);
    }
  }, 2000); // Wait for the app to render
}

/**
 * Refresh avatar asset cache (useful when new assets are added or after app updates)
 */
export async function refreshAvatarAssetCache(): Promise<void> {
  const assetUrls = getAllAvatarAssetUrls();
  if (assetUrls.length > 0) {
    await prefetchAssets(assetUrls);
  }
}
