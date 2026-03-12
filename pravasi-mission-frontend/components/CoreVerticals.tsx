"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function CoreVerticals() {
  const { language } = useLanguage();

  const items = [
    {
      title: "Entrepreneurship, Investment & Enterprise Support",
      tagline: "Turning global experience into local enterprise.",
      body:
        "Return migrants bring with them skills, savings, and global exposure, all powerful ingredients for entrepreneurship. This vertical helps returnees transform that potential into thriving businesses. From validating business ideas and preparing plans, to accessing credit, government schemes, and diaspora investment, we provide end-to-end support. We also connect returnees with NRK mentor networks and facilitate cooperative and cluster-based enterprise models for greater scale and sustainability.",
    },
    {
      title: "Skilling & Employment",
      tagline: "Bridging the gap between global skills and local opportunity.",
      body:
        "Many returnees possess valuable skills and work experience that often go unrecognised in the domestic job market. This vertical works to change that, through skill mapping, Recognition of Prior Learning (RPL), customised reskilling programs, and direct placement support. In partnership with agencies like KASE, ASAP, and K-DISC, we align returnees with high-growth sectors such as digital services, healthcare, logistics, and renewable energy, ensuring their expertise translates into meaningful employment.",
    },
    {
      title: "Organisation, Convergence & Civic Engagement",
      tagline: "Rooting returnees back into the heart of Kerala's communities.",
      body:
        "Reintegration is not just economic; it is social and civic. This vertical ensures that return migrants and NRKs are active participants in Kerala's development. We coordinate across government departments, Local Self-Governments, Kudumbashree, and civil society to deliver integrated services at the grassroots level. Through Pravasi Gramasabhas, community campaigns, and decentralised engagement, we empower returnees to contribute to the places they call home.",
    },
  ];

  const heading =
    language === "en" ? "Three Core Verticals" : "Three Core Verticals";

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center mb-10">{heading}</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item, index) => (
            <article
              key={index}
              className="border border-green-900 dark:border-gray-700 bg-white
               dark:bg-gray-800 rounded-xl p-6 h-full"
            >
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-300 mb-2">
                {item.title}
              </h3>
              <p className="text-green-900/80 dark:text-green-200 mb-4">
                {item.tagline}
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
