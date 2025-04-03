export type CategoryType =
  | "face"
  | "hair"
  | "eyes"
  | "mouth"
  | "accessories"
  | "outfit"
  | "background";

export type BackgroundOption = {
  type: "color" | "image" | "transparent";
  value: string | null;
};

export interface AvatarSelections {
  face: string | null;
  hair: string | null;
  eyes: string | null;
  mouth: string | null;
  accessories: string | null;
  outfit: string | null;
  background: string | null;
  backgroundColor: BackgroundOption;
}

export interface CategorySelectorProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

export interface ItemSelectorProps {
  category: CategoryType;
  selectedItem: string | null;
  onSelectItem: (item: string | null) => void;
}

export interface AvatarPreviewProps {
  selections: AvatarSelections;
  shape?: "circle" | "square";
}

export interface ExportOptionsProps {
  selections: AvatarSelections;
  variant?: "default" | "outline";
  isGrouped?: boolean;
}

// PWA related types
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export interface PWARegisterOptions {
  immediate?: boolean;
  onNeedRefresh?: () => void;
  onOfflineReady?: () => void;
  onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
  onRegisterError?: (error: Error) => void;
}

// Global type for the PWA register function
declare global {
  interface Window {
    __PWA_REGISTER_SW?: (
      options?: PWARegisterOptions
    ) => (reloadPage?: boolean) => Promise<void>;
  }
}
