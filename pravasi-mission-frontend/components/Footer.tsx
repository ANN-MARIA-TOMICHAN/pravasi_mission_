"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="py-3 bg-green-800 text-white dark:bg-neutral-800 dark:border-neutral-900 dark:text-neutral-800">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/6 flex justify-center mb-4 md:mb-0">
            <a
              href="https://duk.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-100"
              title="Digital University Kerala"
            >
              <div className="rounded-full bg-white text-center p-2 w-[200px]">
                <Image
                  src="/assets/images/logos/duk-logo.png"
                  alt="Digital University Kerala"
                  className="mx-auto"
                  width={143}
                  height={50}
                />
              </div>
            </a>
          </div>

          <div className="w-full md:w-4/6 text-center">
            <p className="mb-2 text-sm text-neutral-100 dark:text-neutral-500">
              {language === "en" ? "Designed, Developed, and Implemented by" : "രൂപകൽപ്പനയും വികസനവും നടപ്പാക്കലും:"}{" "}
              <a
                href="https://duk.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-100 hover:underline dark:text-neutral-500"
              >
                Centre for Digital Innovation and Product Development (CDIPD)
              </a>
            </p>
            <p className="text-xs text-neutral-100 dark:text-neutral-500">
              {language === "en" ? "A Centre of Excellence Established by" : "സ്ഥാപിച്ച ഉന്നത കേന്ദ്രം:"}{" "}
              <a
                href="https://duk.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-100 hover:underline  dark:text-neutral-500"
              >
                Digital University Kerala
              </a>
            </p>
          </div>

          <div className="w-full md:w-1/6 flex justify-center">
            <a
              href="https://duk.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800"
              title="Digital University Kerala"
            >
              <div className="rounded-full bg-white text-center p-2 w-[200px]">
                <Image
                  src="/assets/images/logos/cdipd-logo.jpg"
                  alt="Digital University Kerala"
                  className="mx-auto"
                  width={143}
                  height={50}
                />
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
