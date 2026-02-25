"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function CTA() {
  const { language } = useLanguage();

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            backgroundImage: "url('/assets/images/discover.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-black/70 to-black/10" />

          <div className="relative z-10 p-10 md:p-14 flex items-center">
            <div className="text-white max-w-lg">
              <h2 className="text-3xl md:text-4xl font-semibold">
                {language === "en" ? "Discover More Schemes" : "കൂടുതൽ പദ്ധതികൾ കണ്ടെത്തുക"}
              </h2>

              <p className="mt-3">
                {language === "en"
                  ? "Browse our full range of schemes designed to support your reintegration and empowerment journey."
                  : "നിങ്ങളുടെ പുനരധിവാസവും ശാക്തീകരണവും പിന്തുണയ്ക്കുന്ന മുഴുവൻ പദ്ധതികളും പരിശോധിക്കുക."}
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <button className="bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-100 transition">
                  {language === "en" ? "Explore All Schemes" : "എല്ലാ പദ്ധതികളും കാണുക"}
                </button>

                <button className="border border-white text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-white hover:text-black transition">
                  {language === "en" ? "Contact Us" : "ഞങ്ങളെ ബന്ധപ്പെടുക"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
