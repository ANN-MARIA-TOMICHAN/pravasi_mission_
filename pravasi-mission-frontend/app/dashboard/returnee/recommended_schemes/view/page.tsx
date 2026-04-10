"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type SchemeRecord = {
  scheme_id?: number;
  scheme_name?: string;
  skill_sector?: string;
  objective_purpose?: string;
  target_beneficiaries?: string;
  eligibility_criteria?: string;
  duration?: string;
  nature_of_assistance?: string;
  implementing_mechanism?: string;
  application_process_nodal_office?: string;
  funding_source?: string;
  annual_outlay_raw?: string;
  existing_beneficiaries_raw?: string;
  potential_linkage_with_pravasi_mission?: string;
  remarks_gaps_identified?: string;
  scheme_type_name?: string;
  category_name?: string;
  department_agencies?: string[];
};

export default function SchemeDetailPage() {
  const searchParams = useSearchParams();
  const schemeId = searchParams.get("schemeId");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [loading, setLoading] = useState(true);
  const [scheme, setScheme] = useState<SchemeRecord | null>(null);

  useEffect(() => {
    if (!baseUrl || !schemeId) {
      setLoading(false);
      return;
    }

    const loadScheme = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/schemes/${schemeId}`, {
          method: "GET",
          cache: "no-store",
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) return;

        const data = ((payload as { data?: unknown })?.data ?? payload) as SchemeRecord;
        setScheme(data ?? null);
      } finally {
        setLoading(false);
      }
    };

    loadScheme();
  }, [baseUrl, schemeId]);

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading scheme details...</p>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">Scheme not found.</p>
        <Link
          href="/dashboard/returnee/recommended_schemes"
          className="inline-flex rounded-md border border-green-700 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-gray-700"
        >
          Back to Schemes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {scheme.scheme_name || "Scheme Detail"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            ID: {scheme.scheme_id ?? "-"}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/dashboard/returnee/recommended_schemes"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Back
          </Link>
          <Link
            href={`/dashboard/returnee/recommended_schemes/apply?schemeId=${scheme.scheme_id}`}
            className="rounded-md bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800"
          >
            Apply
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DetailCard
          title="Overview"
          items={[
            ["Scheme Type", scheme.scheme_type_name],
            ["Category", scheme.category_name],
            ["Skill Sector", scheme.skill_sector],
            ["Target Beneficiaries", scheme.target_beneficiaries],
            ["Eligibility Criteria", scheme.eligibility_criteria],
            ["Duration", scheme.duration],
          ]}
        />

        <DetailCard
          title="Support Details"
          items={[
            ["Nature of Assistance", scheme.nature_of_assistance],
            ["Funding Source", scheme.funding_source],
            ["Annual Outlay", scheme.annual_outlay_raw],
            ["Existing Beneficiaries", scheme.existing_beneficiaries_raw],
            [
              "Department / Agency",
              Array.isArray(scheme.department_agencies) && scheme.department_agencies.length > 0
                ? scheme.department_agencies.join(", ")
                : undefined,
            ],
            ["Application / Nodal Office", scheme.application_process_nodal_office],
          ]}
        />
      </div>

      <DetailCard
        title="Description"
        items={[
          ["Objective / Purpose", scheme.objective_purpose],
          ["Implementing Mechanism", scheme.implementing_mechanism],
          ["Pravasi Mission Linkage", scheme.potential_linkage_with_pravasi_mission],
          ["Remarks / Gaps Identified", scheme.remarks_gaps_identified],
        ]}
      />
    </div>
  );
}

function DetailCard({
  title,
  items,
}: {
  title: string;
  items: Array<[string, string | undefined]>;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      <div className="mt-5 space-y-4">
        {items.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs font-medium uppercase tracking-wide text-green-700 dark:text-green-400">
              {label}
            </p>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{value || "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
