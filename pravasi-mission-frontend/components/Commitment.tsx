"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function Commitment() {
  const { language } = useLanguage();

  const t = {
    title: language === "en" ? "Our Commitment" : "ഞങ്ങളുടെ പ്രതിബദ്ധത",
    subtitle:
      language === "en"
        ? "The Kerala Pravasi Mission supports returnees in rebuilding their lives and settling confidently in Kerala."
        : "കേരള പ്രവാസി മിഷൻ മടങ്ങിയെത്തിയ പ്രവാസികൾക്ക് ജീവിതം പുനർനിർമിച്ച് ആത്മവിശ്വാസത്തോടെ കേരളത്തിൽ സ്ഥിരത നേടാൻ പിന്തുണ നൽകുന്നു.",
    description:
      language === "en"
        ? "Pravasi Mission is dedicated to supporting Keralite returnees in their journey of reintegration and self-reliance. We provide a wide range of services, including skill development, business support, welfare assistance, and guidance on government schemes. By connecting returnees with local authorities, volunteers, and resources across all 14 districts, we aim to ensure a smooth transition, sustainable livelihood, and long-term well-being."
        : "പ്രവാസി മിഷൻ കേരളീയ മടങ്ങിയെത്തിയ പ്രവാസികളുടെ പുനരധിവാസവും സ്വയംപര്യാപ്തതയും ലക്ഷ്യമാക്കി പ്രവർത്തിക്കുന്നു. നൈപുണ്യ വികസനം, ബിസിനസ് പിന്തുണ, ക്ഷേമസഹായം, സർക്കാർ പദ്ധതികളിലേക്കുള്ള മാർഗ്ഗനിർദ്ദേശം എന്നിവ ഉൾപ്പെടെ വിപുലമായ സേവനങ്ങൾ നൽകുന്നു. 14 ജില്ലകളിലുമുള്ള പ്രാദേശിക അധികാരികളെയും സന്നദ്ധ പ്രവർത്തകരെയും വിഭവങ്ങളെയും ബന്ധിപ്പിച്ച് സുതാര്യമായ മാറിച്ചേരൽ, സ്ഥിരതയാർന്ന ഉപജീവനം, ദീർഘകാല ക്ഷേമം എന്നിവ ഉറപ്പാക്കുകയാണ് ലക്ഷ്യം.",
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center mb-12">{t.title}</h2>
        <h6 className="font-extralight text-center mb-12">{t.subtitle}</h6>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <Image
            src="/assets/images/commit.png"
            alt="Commitment"
            width={600}
            height={400}
            className="rounded-lg w-full"
          />

          <p className="leading-relaxed text-gray-700 dark:text-gray-300">{t.description}</p>
        </div>
      </div>
    </section>
  );
}
