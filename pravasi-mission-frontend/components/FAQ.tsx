"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { language } = useLanguage();

  const faqs = [
    {
      q:
        language === "en"
          ? "Who can use Pravasi Mission services?"
          : "പ്രവാസി മിഷൻ സേവനങ്ങൾ ഉപയോഗിക്കാൻ ആർക്കെല്ലാം കഴിയും?",
      a:
        language === "en"
          ? "Pravasi Mission services are available to eligible Non-Resident Keralites and returnees seeking support for reintegration, livelihood, and welfare."
          : "പുനരധിവാസം, ഉപജീവനം, ക്ഷേമം എന്നിവയ്ക്കുള്ള പിന്തുണ തേടുന്ന അർഹരായ പ്രവാസി കേരളീയർക്കും മടങ്ങിയെത്തിയ പ്രവാസികൾക്കും സേവനങ്ങൾ ലഭ്യമാണ്.",
    },
    {
      q:
        language === "en"
          ? "What type of support is available through Pravasi Mission?"
          : "പ്രവാസി മിഷൻ വഴി എന്തെല്ലാം പിന്തുണ ലഭ്യമാണ്?",
      a:
        language === "en"
          ? "Employment support, skill development, welfare schemes, and business guidance are available."
          : "തൊഴിൽ പിന്തുണ, നൈപുണ്യ വികസനം, ക്ഷേമപദ്ധതികൾ, സംരംഭക മാർഗ്ഗനിർദ്ദേശം എന്നിവ ലഭ്യമാണ്.",
    },
    {
      q:
        language === "en"
          ? "How do I apply for schemes and services?"
          : "പദ്ധതികൾക്കും സേവനങ്ങൾക്കും എങ്ങനെ അപേക്ഷിക്കാം?",
      a:
        language === "en"
          ? "Sign up, complete your profile, and submit applications through your dashboard."
          : "സൈൻ അപ്പ് ചെയ്ത് പ്രൊഫൈൽ പൂർത്തിയാക്കി ഡാഷ്ബോർഡ് വഴി അപേക്ഷകൾ സമർപ്പിക്കാം.",
    },
    {
      q:
        language === "en"
          ? "How will I know if I am eligible for a scheme?"
          : "ഒരു പദ്ധതിക്ക് ഞാൻ അർഹനാണോ എന്ന് എങ്ങനെ അറിയാം?",
      a:
        language === "en"
          ? "Eligibility criteria are shown per scheme. Your profile details help match relevant schemes."
          : "ഓരോ പദ്ധതിയിലും അർഹത മാനദണ്ഡങ്ങൾ കാണിക്കും. നിങ്ങളുടെ പ്രൊഫൈൽ വിവരങ്ങൾ അനുയോജ്യമായ പദ്ധതികൾ കണ്ടെത്താൻ സഹായിക്കും.",
    },
    {
      q:
        language === "en"
          ? "Who can I contact for support or queries?"
          : "സഹായത്തിനോ സംശയങ്ങൾക്കോ ആരെ സമീപിക്കാം?",
      a:
        language === "en"
          ? "You can use the support section in the portal or contact your district support office."
          : "പോർട്ടലിലെ സപ്പോർട്ട് വിഭാഗം ഉപയോഗിക്കുകയോ ജില്ലയിലെ സഹായ ഓഫിസുമായി ബന്ധപ്പെടുകയോ ചെയ്യാം.",
    },
  ];

  return (
    <section className="py-16 ">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center">
          {language === "en" ? "Frequently Asked Questions" : "പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ"}
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
          {language === "en"
            ? "Got questions? We have got the answers you need"
            : "ചോദ്യങ്ങളുണ്ടോ? ആവശ്യമായ ഉത്തരങ്ങൾ ഇവിടെ ലഭിക്കും"}
        </p>

        <div className="mt-10 space-y-4">
          {faqs.map((item, index) => (
            <div key={index} className="border dark:border-gray-700 rounded-lg">
              <button
                className="w-full text-left p-5 flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium">{item.q}</span>
                <span className="text-xl">{openIndex === index ? "-" : "+"}</span>
              </button>

              {openIndex === index && <div className="px-5 pb-5 ">{item.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
