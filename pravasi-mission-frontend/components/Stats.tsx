"use client";

import { Briefcase, Users, TrendingUp, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Stats() {
  const { language } = useLanguage();

  const stats = [
    { value: "10K+", label: language === "en" ? "Returnees Supported" : "പിന്തുണ ലഭിച്ച പ്രവാസികൾ" },
    { value: "15+", label: language === "en" ? "Schemes & Services" : "പദ്ധതികളും സേവനങ്ങളും" },
    { value: "25K+", label: language === "en" ? "Applications Processed" : "പ്രോസസ് ചെയ്ത അപേക്ഷകൾ" },
    { value: "14", label: language === "en" ? "Districts" : "ജില്ലകൾ" },
  ];

  const services = [
    {
      title: language === "en" ? "Employment & Skill Support" : "തൊഴിൽ & നൈപുണ്യ പിന്തുണ",
      description:
        language === "en"
          ? "Career guidance, skill training, and job-linked opportunities."
          : "കരിയർ മാർഗ്ഗനിർദ്ദേശം, നൈപുണ്യ പരിശീലനം, തൊഴിൽ അവസരങ്ങൾ.",
      icon: Briefcase,
    },
    {
      title: language === "en" ? "Reintegration Support" : "പുനരധിവാസ പിന്തുണ",
      description:
        language === "en"
          ? "Assistance for a smooth return and settling back into life in Kerala."
          : "സുഗമമായ മടക്കത്തിനും കേരള ജീവിതത്തിലേക്കുള്ള തിരിച്ചുചേരലിനുമുള്ള സഹായം.",
      icon: Users,
    },
    {
      title: language === "en" ? "Self-Employment Support" : "സ്വയംതൊഴിൽ പിന്തുണ",
      description:
        language === "en"
          ? "Support to start or grow enterprises, including financial and advisory help."
          : "സംരംഭങ്ങൾ ആരംഭിക്കാനും വികസിപ്പിക്കാനും ധന-ഉപദേശ സഹായം.",
      icon: TrendingUp,
    },
    {
      title: language === "en" ? "Welfare Support" : "ക്ഷേമ പിന്തുണ",
      description:
        language === "en"
          ? "Access to eligible welfare schemes, financial aid, and pension benefits."
          : "അർഹമായ ക്ഷേമപദ്ധതികൾ, ധനസഹായം, പെൻഷൻ ആനുകൂല്യങ്ങൾ ലഭ്യമാക്കൽ.",
      icon: HeartHandshake,
    },
  ];

  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center mb-12">
          {language === "en" ? "Our Impact So Far" : "ഇതുവരെ ഉണ്ടായ സ്വാധീനം"}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-16">
          {stats.map((item, index) => (
            <div key={index}>
              <h3 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400">{item.value}</h3>
              <p className="mt-2 text-green-800 dark:text-green-400 text-sm">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="bg-green-50 dark:bg-gray-800 border border-green-100 dark:border-gray-700 p-6 rounded-xl"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-green-700 rounded-md mb-4">
                  <Icon className="text-white w-5 h-5 items " />
                </div>

                <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">{service.title}</h4>

                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
