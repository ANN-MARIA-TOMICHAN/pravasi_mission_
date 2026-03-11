"use client";

import { useEffect, useState } from "react";

const PROFILE_IMAGE_STORAGE_KEY_PREFIX = "profileImage:";
const PROFILE_IMAGE_UPDATED_EVENT = "profile-image-updated";

function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;
  const cookieValue = `; ${document.cookie}`;
  const parts = cookieValue.split(`; userDetails=`);
  if (parts.length !== 2) return null;

  const raw = decodeURIComponent(parts.pop()?.split(";").shift() ?? "");
  try {
    const parsed = JSON.parse(raw) as { id?: string };
    return parsed?.id ? String(parsed.id) : null;
  } catch {
    return null;
  }
}

function getProfileImageStorageKey(userId: string | null) {
  return userId ? `${PROFILE_IMAGE_STORAGE_KEY_PREFIX}${userId}` : null;
}

export function getStoredProfileImage(): string | null {
  if (typeof window === "undefined") return null;
  const key = getProfileImageStorageKey(getCurrentUserId());
  if (!key) return null;
  return window.localStorage.getItem(key);
}

export function setStoredProfileImage(imageDataUrl: string) {
  if (typeof window === "undefined") return;
  const key = getProfileImageStorageKey(getCurrentUserId());
  if (!key) return;
  window.localStorage.setItem(key, imageDataUrl);
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
    window.addEventListener("focus", syncImage);

    return () => {
      window.removeEventListener(PROFILE_IMAGE_UPDATED_EVENT, syncImage);
      window.removeEventListener("storage", syncImage);
      window.removeEventListener("focus", syncImage);
    };
  }, [defaultImage]);

  const setProfileImage = (imageDataUrl: string) => {
    setStoredProfileImage(imageDataUrl);
    setProfileImageState(imageDataUrl);
  };

  return { profileImage, setProfileImage };
}
