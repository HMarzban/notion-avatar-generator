import { useRef } from "react";

/**
 * Hook to handle avatar container operations
 */
export const useAvatarContainer = () => {
  const avatarContainerRef = useRef<HTMLDivElement | null>(null);

  const findAvatarContainer = (): HTMLDivElement | null => {
    if (!avatarContainerRef.current) {
      const container = document.querySelector(
        "[data-avatar-container]"
      ) as HTMLDivElement;
      if (container) {
        avatarContainerRef.current = container;
      }
    }
    return avatarContainerRef.current;
  };

  const isCircular = (element: HTMLElement): boolean => {
    return element.classList.contains("rounded-full");
  };

  return { findAvatarContainer, isCircular };
};
