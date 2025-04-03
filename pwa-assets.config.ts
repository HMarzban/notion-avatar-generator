import {
  defineConfig,
  minimal2023Preset,
} from "@vite-pwa/assets-generator/config";

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: {
      sizes: [512],
      padding: 0,
    },
    apple: {
      sizes: [180],
    },
    transparent: {
      sizes: [64, 192, 512],
    },
  },
  images: ["public/icon.png"],
});
