"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Schemes() {
  const { language } = useLanguage();

  const schemes = [
    {
      title: language === "en" ? "Krishi Samridhi" : "കൃഷി സമൃദ്ധി",
      desc:
        language === "en"
          ? "Support for agricultural ventures and sustainable farming practices"
          : "കൃഷി സംരംഭങ്ങൾക്കും സ്ഥിരതയാർന്ന കൃഷിരീതികൾക്കും പിന്തുണ",
      img: "/assets/images/1_1.png",
    },
    {
      title: language === "en" ? "Udyam Vikas" : "ഉദ്യമ വികാസ്",
      desc:
        language === "en"
          ? "Assistance for establishing and growing small businesses and enterprises"
          : "ചെറുകിട ബിസിനസുകൾ ആരംഭിക്കാനും വികസിപ്പിക്കാനും സഹായം",
      img: "/assets/images/1_2.png",
    },
    {
      title: language === "en" ? "Kaushal Kendra" : "കൗശൽ കേന്ദ്ര",
      desc:
        language === "en"
          ? "Skill development programs to enhance employability and career prospects"
          : "തൊഴിൽയോഗ്യതയും കരിയർ സാധ്യതകളും ഉയർത്തുന്ന നൈപുണ്യ പരിശീലന പരിപാടികൾ",
      img: "/assets/images/1_3.png",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <p className="text-sm font-semibold tracking-widest text-green-700 dark:text-green-400">
              {language === "en" ? "OUR SERVICES" : "ഞങ്ങളുടെ സേവനങ്ങൾ"}
            </p>

            <h2 className="text-3xl md:text-4xl font-semibold mt-2">
              {language === "en" ? "Schemes You Can Benefit From" : "നിങ്ങൾക്ക് പ്രയോജനം ലഭിക്കുന്ന പദ്ധതികൾ"}
            </h2>

            <p className="mt-3 max-w-xl text-gray-600 dark:text-gray-400">
              {language === "en"
                ? "Featured schemes that support your return, livelihood, and well-being in Kerala."
                : "കേരളത്തിലെ നിങ്ങളുടെ മടങ്ങിവരവും ഉപജീവനവും ക്ഷേമവും പിന്തുണയ്ക്കുന്ന പ്രധാന പദ്ധതികൾ."}
            </p>
          </div>

          <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            {language === "en" ? "Explore All Services" : "എല്ലാ സേവനങ്ങളും കാണുക"}
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {schemes.map((item, index) => (
            <div
              key={index}
              className="border dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition"
            >
              <Image src={item.img} alt={item.title} width={400} height={250} className="w-full object-cover" />

              <div className="p-5">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="mt-2 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
