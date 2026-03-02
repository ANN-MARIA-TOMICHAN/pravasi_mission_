"use client";

import {Menu,Search,Bell,ShoppingCart,Sun,Moon,X,} from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { ThemeToggle } from "../theme-toggle";
import { useProfileImage } from "@/lib/profileImage";
export default function Header({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { setTheme, resolvedTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { profileImage } = useProfileImage("/assets/images/user_default.png");

  const isDark = resolvedTheme === "dark";

  return (
    <header
      className={`w-full px-4 md:px-6 py-3 border-b
        ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}
      `}
    >
      {/* TOP BAR */}
      <div className="flex items-center justify-between">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-2">
          {/* HAMBURGER — MOBILE ONLY */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-md hover:bg-green-200 transition"
          >
            <Menu size={20} className="text-green-700" />
          </button>

          {/* DESKTOP SEARCH */}
          <div className="relative w-80 hidden md:block">
            <input
              type="text"
              placeholder='Search (ctrl + "/" to focus)'
              className={`w-full px-4 py-2 pr-10 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-green-600
                ${
                  isDark
                    ? "bg-green-50 text-green-100 placeholder-gray-400"
                    : "bg-green-50 text-gray-800 placeholder-gray-500"
                }
              `}
            />
            <Search
              size={18}
              className={`absolute right-3 top-1/2 -translate-y-1/2
                ${isDark ? "text-green-800" : "text-green-700"}
              `}
            />
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* MOBILE SEARCH ICON */}
          <ThemeToggle/> 
          <button
            onClick={() => setMobileSearchOpen(true)}
            className="md:hidden p-2 rounded-md hover:bg-green-200 transition"
          >
            <Search size={18} className="text-green-700" />
          </button>

          <IconButton isDark={isDark}>
            <ShoppingCart size={18} />
          </IconButton>

          <div className="relative">
            <IconButton isDark={isDark}>
              <Bell size={18} />
            </IconButton>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
          </div>

          <button
            onClick={toggleLanguage}
            className={`hidden sm:block p-2 font-medium rounded-md transition
              ${
                isDark
                  ? "text-green-600 hover:bg-green-100"
                  : "text-green-700 hover:bg-green-200"
              }
            `}
          >
            {language === "en" ? "EN" : "മ"}
          </button>

          

          <button className="rounded-full hover:ring-2 hover:ring-green-200 transition">
            <Image
              src={profileImage}
              alt="Profile"
              width={32}
              height={32}
              unoptimized={profileImage.startsWith("data:")}
              className={`rounded-full ring-1
                ${isDark ? "ring-green-100" : "ring-gray-300"}
              `}
            />
          </button>
        </div>
      </div>

      {/* ✅ MOBILE SEARCH BAR */}
      {mobileSearchOpen && (
        <div className="mt-3 md:hidden">
          <div className="relative">
            <input
              autoFocus
              type="text"
              placeholder="Search..."
              className={`w-full px-4 py-2 pr-10 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-green-600
                ${
                  isDark
                    ? "bg-green-50 text-green-100 placeholder-gray-400"
                    : "bg-green-50 text-gray-800 placeholder-gray-500"
                }
              `}
            />
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function IconButton({
  children,
  isDark,
}: {
  children: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <button
      className={`p-2 rounded-md transition
        ${
          isDark
            ? "text-green-600 hover:bg-green-100"
            : "text-green-700 hover:bg-green-200"
        }
      `}
    >
      {children}
    </button>
  );
}
