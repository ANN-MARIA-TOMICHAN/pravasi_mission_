"use client";

import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SchemeRecord = {
  scheme_id?: number;
  scheme_name?: string;
  skill_sector?: string;
  objective_purpose?: string;
  target_beneficiaries?: string;
  eligibility_criteria?: string;
  duration?: string;
  nature_of_assistance?: string;
  scheme_type_name?: string;
  category_name?: string;
  department_agencies?: string[];
};

type FilterKey = "oneEligibility" | "highMatch" | "financialAid" | "skill" | "housing";

function computeMatchScore(scheme: SchemeRecord) {
  const text = [
    scheme.scheme_name,
    scheme.skill_sector,
    scheme.objective_purpose,
    scheme.target_beneficiaries,
    scheme.eligibility_criteria,
    scheme.nature_of_assistance,
    scheme.scheme_type_name,
    scheme.category_name,
    ...(scheme.department_agencies ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  let score = 65;
  if (text.includes("pravasi")) score += 10;
  if (text.includes("return")) score += 10;
  if (text.includes("employment")) score += 5;
  if (text.includes("skill")) score += 5;
  if (text.includes("financial") || text.includes("loan") || text.includes("subsidy")) score += 5;
  return Math.min(score, 98);
}

function matchesFilter(filter: FilterKey, scheme: SchemeRecord) {
  const text = [
    scheme.scheme_name,
    scheme.skill_sector,
    scheme.objective_purpose,
    scheme.target_beneficiaries,
    scheme.eligibility_criteria,
    scheme.nature_of_assistance,
    scheme.scheme_type_name,
    scheme.category_name,
    ...(scheme.department_agencies ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  switch (filter) {
    case "oneEligibility":
      return Boolean(scheme.eligibility_criteria);
    case "highMatch":
      return computeMatchScore(scheme) >= 85;
    case "financialAid":
      return ["financial", "loan", "subsidy", "fund", "assistance", "aid"].some((word) =>
        text.includes(word)
      );
    case "skill":
      return ["skill", "training", "employment", "reskilling"].some((word) => text.includes(word));
    case "housing":
      return ["housing", "house", "home", "shelter"].some((word) => text.includes(word));
    default:
      return true;
  }
}

function oneLineDescription(scheme: SchemeRecord) {
  const text = scheme.objective_purpose || scheme.nature_of_assistance || scheme.target_beneficiaries || "";
  if (!text) return "No description available.";
  const clean = text.trim();
  return clean.length > 110 ? `${clean.slice(0, 107)}...` : clean;
}

function getCardMeta(filter: FilterKey, scheme: SchemeRecord, index: number) {
  const score = computeMatchScore(scheme);
  const badge =
    filter === "oneEligibility" && scheme.eligibility_criteria ? "Eligible" : `${score}% Match`;
  const primaryAction =
    filter === "oneEligibility" ? "Check Eligibility" : score >= 88 ? "Apply Now" : "Check Eligibility";
  const footer =
    scheme.nature_of_assistance ||
    scheme.duration ||
    scheme.skill_sector ||
    scheme.scheme_type_name ||
    "Scheme details available";
  const images = [
    "/assets/images/scheme1.jfif",
    "/assets/images/scheme2.jfif",
    "/assets/images/scheme3.jfif",
  ];

  return {
    badge,
    primaryAction,
    footer,
    imageSrc: images[index % images.length],
  };
}

export default function RecommendedSchemesPage() {
  const { language } = useLanguage();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [activeFilter, setActiveFilter] = useState<FilterKey>("oneEligibility");
  const [loading, setLoading] = useState(true);
  const [schemes, setSchemes] = useState<SchemeRecord[]>([]);

  const filters = [
    { key: "oneEligibility" as const, label: "One Eligibility" },
    { key: "highMatch" as const, label: "High Match" },
    { key: "financialAid" as const, label: "Financial Aid" },
    { key: "skill" as const, label: "Skill Development" },
    { key: "housing" as const, label: "Housing" },
  ];

  useEffect(() => {
    if (!baseUrl) {
      setLoading(false);
      return;
    }

    const loadSchemes = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/schemes?limit=24`, {
          method: "GET",
          cache: "no-store",
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) return;

        const data = ((payload as { data?: unknown })?.data ?? payload) as SchemeRecord[];
        setSchemes(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    };

    loadSchemes();
  }, [baseUrl]);

  const filteredSchemes = useMemo(
    () => schemes.filter((scheme) => matchesFilter(activeFilter, scheme)),
    [activeFilter, schemes]
  );

  return (
    <div className="space-y-6 text-gray-800 dark:text-gray-100">
      <div>
        <h1 className="text-2xl font-semibold">
          {language === "en" ? "Recommended Schemes" : "Recommended Schemes"}
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {language === "en"
            ? "Based on your NRK profile, here are the welfare programs you match with"
            : "Based on your NRK profile, here are the welfare programs you match with"}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.key;

          return (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                isActive
                  ? "bg-green-700 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading schemes...</p>
        </div>
      ) : filteredSchemes.length === 0 ? (
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No schemes match this filter right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredSchemes.map((scheme, index) => {
            const meta = getCardMeta(activeFilter, scheme, index);

            return (
              <div
                key={scheme.scheme_id ?? scheme.scheme_name}
                className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="relative h-44">
                  <Image
                    src={meta.imageSrc}
                    alt={scheme.scheme_name || "Scheme"}
                    fill
                    className="object-cover object-center"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-green-700 px-3 py-1.5 text-xs font-medium text-white">
                    {meta.badge}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-2 min-h-[3.5rem] text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
                    {scheme.scheme_name || "-"}
                  </h3>
                  <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-gray-600 dark:text-gray-400">
                    {oneLineDescription(scheme)}
                  </p>

                  <div className="mt-3 line-clamp-2 min-h-[2.5rem] text-xs leading-5 text-gray-500 dark:text-gray-400">
                    {meta.footer}
                  </div>

                  <div className="mt-auto flex gap-3 pt-4">
                    <Link
                      href={`/dashboard/returnee/recommended_schemes/apply?schemeId=${scheme.scheme_id}`}
                      className="flex-1"
                    >
                      <button className="w-full rounded-xl bg-green-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-800">
                        {meta.primaryAction}
                      </button>
                    </Link>
                    <Link href={`/dashboard/returnee/recommended_schemes/view?schemeId=${scheme.scheme_id}`}>
                      <button className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
