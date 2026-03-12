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
      ? [
          "Kerala is home to nearly 1.8 million return migrants, men and women who spent years abroad, contributing to the state's economy through their labour, remittances, and global exposure. As they return, many face the challenge of rebuilding livelihoods in a familiar yet changed homeland.",

          "The Kerala Pravasi Sustainable Development Mission, Pravasi Mission, is the Government of Kerala's dedicated institutional response to this challenge. Established under the Department of Non-Resident Keralites Affairs (NORKA), the Mission brings together government departments, financial institutions, skilling agencies, and community organisations under one unified platform to support the economic and social reintegration of return migrants.",

          "Since 2013, Kerala's reintegration efforts have directly supported over 23,000 returnees and mobilised ₹1,292 crore in investments. The Pravasi Mission builds on this foundation, expanding reach, deepening impact, and ensuring no returnee is left without support."
        ]
      : [
          "കേരളത്തിൽ ഏകദേശം 18 ലക്ഷം മടങ്ങിയെത്തിയ പ്രവാസികൾ താമസിക്കുന്നു. വർഷങ്ങളോളം വിദേശത്ത് ജോലി ചെയ്ത് അവരുടെ പരിശ്രമം, റിമിറ്റൻസുകൾ, ആഗോള പരിചയം എന്നിവ വഴി സംസ്ഥാനത്തിന്റെ സമ്പദ്‌വ്യവസ്ഥയ്ക്ക് സംഭാവന ചെയ്ത പുരുഷന്മാരും സ്ത്രീകളുമാണ് അവർ. നാട്ടിലേക്ക് മടങ്ങിയെത്തുമ്പോൾ പലർക്കും പരിചിതമായെങ്കിലും മാറ്റങ്ങൾ സംഭവിച്ച മാതൃഭൂമിയിൽ പുതിയ ജീവിതവും ഉപജീവനവും പുനർനിർമിക്കേണ്ട വെല്ലുവിളി നേരിടേണ്ടിവരുന്നു.",

          "ഈ വെല്ലുവിളിക്കുള്ള കേരള സർക്കാരിന്റെ സ്ഥാപനാത്മകമായ മറുപടിയാണ് കേരള പ്രവാസി സുസ്ഥിര വികസന മിഷൻ (പ്രവാസി മിഷൻ). നോർക്ക (Non-Resident Keralites Affairs) വകുപ്പിന്റെ കീഴിൽ സ്ഥാപിതമായ ഈ മിഷൻ സർക്കാർ വകുപ്പുകൾ, ധനകാര്യ സ്ഥാപനങ്ങൾ, സ്കിൽ വികസന ഏജൻസികൾ, സമൂഹ സംഘടനകൾ എന്നിവയെ ഒരുമിച്ചുള്ള ഒരു ഏകോപിത വേദിയിൽ കൊണ്ടുവന്ന് മടങ്ങിയെത്തിയ പ്രവാസികളുടെ സാമ്പത്തികവും സാമൂഹികവുമായ പുനരധിവാസത്തെ പിന്തുണയ്ക്കുന്നു.",

          "2013 മുതൽ കേരളത്തിന്റെ പുനരധിവാസ പ്രവർത്തനങ്ങൾ 23,000-ത്തിലധികം മടങ്ങിയെത്തിയ പ്രവാസികളെ നേരിട്ട് സഹായിക്കുകയും ₹1,292 കോടി നിക്ഷേപം സജ്ജമാക്കുകയും ചെയ്തിട്ടുണ്ട്. ഈ അടിസ്ഥാനത്തെ തുടർന്നാണ് പ്രവാസി മിഷൻ തന്റെ പ്രവർത്തന പരിധി വിപുലീകരിക്കുകയും സ്വാധീനം കൂടുതൽ ശക്തമാക്കുകയും ഒരുപോലും മടങ്ങിയെത്തിയ പ്രവാസി പിന്തുണയില്ലാതെ പോകാതിരിക്കാൻ ഉറപ്പാക്കുകയും ചെയ്യുന്നത്."
        ]
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

          <div className="leading-relaxed text-gray-700 dark:text-gray-300">
            {t.description.map((para, index) => (
              <p key={index} className="mb-4">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
