"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function VisionMission() {
  const { language } = useLanguage();

  const content = {
  visionTitle: language === "en" ? "Our Vision" : "ഞങ്ങളുടെ ദർശനം",
  visionText:
    language === "en"
      ? "A Kerala where every return migrant is empowered with dignity, opportunity, and belonging, and every Keralite abroad is a partner in the state's progress."
      : "ഓരോ മടങ്ങിയെത്തിയ പ്രവാസിയും മാന്യതയോടും അവസരങ്ങളോടും സമൂഹത്തിലെ അംഗത്വബോധത്തോടും കൂടെ ശക്തരാകുന്ന ഒരു കേരളം; വിദേശത്തുള്ള ഓരോ കേരളീയനും സംസ്ഥാനത്തിന്റെ പുരോഗതിയിലെ പങ്കാളിയാകുന്ന ഒരു സമൂഹം.",

  missionTitle: language === "en" ? "Our Mission" : "ഞങ്ങളുടെ ദൗത്യം",
  missionText:
    language === "en"
      ? "To provide a comprehensive, inclusive, and sustainable institutional framework for the economic reintegration of return migrants and the meaningful engagement of the Kerala diaspora, through entrepreneurship support, skill development, civic participation, and convergence of government services, ensuring that the contributions of Pravasi Keralites are honoured and their futures secured."
      : "മടങ്ങിയെത്തിയ പ്രവാസികളുടെ സാമ്പത്തിക പുനരധിവാസത്തിനും കേരള പ്രവാസി സമൂഹത്തിന്റെ സാർഥക പങ്കാളിത്തത്തിനും സമഗ്രവും ഉൾക്കൊള്ളുന്നതുമായ ദീർഘകാലസ്ഥായിയുള്ള സ്ഥാപന ഘടന സൃഷ്ടിക്കുക എന്നതാണ് ഞങ്ങളുടെ ദൗത്യം. സംരംഭകത്വ പിന്തുണ, നൈപുണ്യ വികസനം, പൗരപങ്കാളിത്തം, സർക്കാർ സേവനങ്ങളുടെ ഏകോപനം എന്നിവ മുഖേന പ്രവാസി കേരളീയരുടെ സംഭാവനകൾ ആദരിക്കുകയും അവരുടെ ഭാവി സുരക്ഷിതമാക്കുകയും ചെയ്യുന്നതാണ് ലക്ഷ്യം."
};
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="border border-green-100 dark:border-gray-700 bg-green-50 dark:bg-gray-800 rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-semibold text-green-900 dark:text-green-300 mb-4">
            {content.visionTitle}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {content.visionText}
          </p>
        </div>

        <div className="border border-green-100 dark:border-gray-700 bg-green-50 dark:bg-gray-800 rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-green-900 dark:text-green-300 mb-4">
            {content.missionTitle}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {content.missionText}
          </p>
        </div>
      </div>
    </section>
  );
}
