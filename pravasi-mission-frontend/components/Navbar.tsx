"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const { language, toggleLanguage } = useLanguage();

  const t = {
    title:
      language === "en"
        ? "Kerala Pravasi Reintegration & Empowerment Platform"
        : "കേരള പ്രവാസി പുനരധിവാസവും ശാക്തീകരണ പ്ലാറ്റ്ഫോവും",
    login: language === "en" ? "Login" : "ലോഗിൻ",
    signup: language === "en" ? "Sign Up" : "സൈൻ അപ്പ്",
  };

  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-regular text-gray-900 dark:text-gray-100">
          {t.title}
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <button
            onClick={toggleLanguage}
            className="text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 font-medium"
          >
            {language === "en" ? "മ" : "EN"}
          </button>

          <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-green-700">
            {t.login}
          </Link>

          <Link href="/signup" className="bg-green-700 text-white px-5 py-2 rounded-md hover:bg-green-800">
            {t.signup}
          </Link>
        </div>
      </div>
    </nav>
  );
}
