"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Projects() {
  const { language } = useLanguage();

  const projects = [
    {
      title: language === "en" ? "Single Access to Support Services" : "പിന്തുണാ സേവനങ്ങൾക്ക് ഏകീകൃത പ്രവേശനം",
      desc:
        language === "en"
          ? "Access multiple support services and schemes through one integrated platform"
          : "ഒരൊറ്റ ഏകീകൃത പ്ലാറ്റ്ഫോം വഴി നിരവധി സേവനങ്ങളും പദ്ധതികളും ലഭ്യമാക്കുക",
      img: "/assets/images/2_1.png",
    },
    {
      title: language === "en" ? "Guided Support for Returnees" : "മടങ്ങിയെത്തിയ പ്രവാസികൾക്ക് മാർഗ്ഗനിർദ്ദേശ പിന്തുണ",
      desc:
        language === "en"
          ? "Receive structured guidance to navigate reintegration, employment, and welfare services"
          : "പുനരധിവാസം, തൊഴിൽ, ക്ഷേമസേവനങ്ങൾ എന്നിവയ്‌ക്കായി ക്രമബദ്ധമായ മാർഗ്ഗനിർദ്ദേശം ലഭിക്കുക",
      img: "/assets/images/2_2.png",
    },
    {
      title: language === "en" ? "Improved Access to Schemes" : "പദ്ധതികളിലേക്കുള്ള മെച്ചപ്പെട്ട പ്രവേശനം",
      desc:
        language === "en"
          ? "Easily discover and apply for eligible government schemes and benefits"
          : "അർഹമായ സർക്കാർ പദ്ധതികളും ആനുകൂല്യങ്ങളും എളുപ്പത്തിൽ കണ്ടെത്തി അപേക്ഷിക്കുക",
      img: "/assets/images/2_3.png",
    },
    {
      title: language === "en" ? "Local-Level Coordination" : "പ്രാദേശിക തല ഏകോപനം",
      desc:
        language === "en"
          ? "Support through district offices and local bodies for faster assistance"
          : "ജില്ലാ ഓഫീസുകളും പ്രാദേശിക സ്ഥാപനങ്ങളും വഴി വേഗത്തിലുള്ള സഹായം",
      img: "/assets/images/2_4.png",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center">
          {language === "en" ? "FEATURED PROJECTS" : "പ്രധാന പദ്ധതികൾ"}
          <br />
          {language === "en" ? "More Ways We Support You" : "നിങ്ങളെ പിന്തുണയ്ക്കാനുള്ള കൂടുതൽ വഴികൾ"}
        </h2>
        <p className="text-center mt-3">
          {language === "en"
            ? "Supporting returnees in settling, earning and securing their future in Kerala"
            : "മടങ്ങിയെത്തിയ പ്രവാസികൾക്ക് കേരളത്തിൽ സ്ഥിരത, ഉപജീവനം, സുരക്ഷിത ഭാവി ഉറപ്പാക്കാൻ പിന്തുണ"}
        </p>

        <div className="grid md:grid-cols-4 gap-6 mt-12">
          {projects.map((item, index) => (
            <div key={index} className="rounded-xl p-6 text-center shadow-sm">
              <img src={item.img} alt={item.title} className="mx-auto h-32" />
              <h3 className="mt-4 font-semibold text-lg">{item.title}</h3>
              <p className="mt-2 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
