"use client";

import { useEffect, useState } from "react";

const PROFILE_IMAGE_STORAGE_KEY = "profileImage";
const PROFILE_IMAGE_UPDATED_EVENT = "profile-image-updated";

export function getStoredProfileImage(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(PROFILE_IMAGE_STORAGE_KEY);
}

export function setStoredProfileImage(imageDataUrl: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_IMAGE_STORAGE_KEY, imageDataUrl);
  window.dispatchEvent(new Event(PROFILE_IMAGE_UPDATED_EVENT));
}

export function useProfileImage(defaultImage: string) {
  const [profileImage, setProfileImageState] = useState(defaultImage);

  useEffect(() => {
    const syncImage = () => {
      const stored = getStoredProfileImage();
      setProfileImageState(stored || defaultImage);
    };

    syncImage();
    window.addEventListener(PROFILE_IMAGE_UPDATED_EVENT, syncImage);
    window.addEventListener("storage", syncImage);

    return () => {
      window.removeEventListener(PROFILE_IMAGE_UPDATED_EVENT, syncImage);
      window.removeEventListener("storage", syncImage);
    };
  }, [defaultImage]);

  const setProfileImage = (imageDataUrl: string) => {
    setStoredProfileImage(imageDataUrl);
    setProfileImageState(imageDataUrl);
  };

  return { profileImage, setProfileImage };
}
