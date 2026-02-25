"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { language } = useLanguage();

  const t = {
    title:
      language === "en"
        ? "Empowering Returnees, Building Futures"
        : "മടങ്ങിയെത്തിയ പ്രവാസികളെ ശക്തിപ്പെടുത്തി, ഭാവി നിർമ്മിക്കുന്നു",
    description:
      language === "en"
        ? "The Kerala Pravasi Mission helps returnees access guidance, services, and schemes for a smooth transition and a stable life in Kerala."
        : "കേരള പ്രവാസി മിഷൻ മടങ്ങിയെത്തുന്ന പ്രവാസികൾക്ക് മാർഗ്ഗനിർദ്ദേശം, സേവനങ്ങൾ, പദ്ധതികൾ എന്നിവ ലഭ്യമാക്കി കേരളത്തിൽ സ്ഥിരതയാർന്ന ജീവിതത്തിലേക്ക് സുതാര്യമായ മാറ്റത്തിന് സഹായിക്കുന്നു.",
    cta: language === "en" ? "Get Started" : "തുടങ്ങുക",
  };

  return (
    <section className="relative h-[90vh] flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/images/hero.png')",
        }}
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-white">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">{t.title}</h1>

        <p className="mt-4 max-w-xl text-gray-200">{t.description}</p>

        <button className="mt-6 bg-green-700 px-6 py-3 rounded-md">{t.cta}</button>
      </div>
    </section>
  );
}
