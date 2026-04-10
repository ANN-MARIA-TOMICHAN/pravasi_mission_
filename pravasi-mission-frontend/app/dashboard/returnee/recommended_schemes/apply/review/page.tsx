"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ApplySchemeData = {
  scheme?: {
    scheme_id?: number;
    scheme_name?: string;
    eligibility_criteria?: string;
    objective_purpose?: string;
    nature_of_assistance?: string;
  } | null;
  applicant: {
    name: string;
    dob: string;
    email: string;
    phone: string;
    employment: string;
    skills: string[];
  };
};

export default function ApplySchemeReviewPage() {
  const router = useRouter();

  const [data] = useState<ApplySchemeData | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("applySchemeData");
    return saved ? JSON.parse(saved) : null;
  });

  if (!data) {
    return <p className="text-sm text-gray-500">No application data found.</p>;
  }

  function handleApply() {
    // later this will be API call
    router.push(
      "/dashboard/returnee/recommended_schemes/apply/success"
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">

      <h1 className="text-xl font-semibold">
        Review Application
      </h1>

      <ReviewItem label="Scheme Name" value={data.scheme?.scheme_name || "-"} />
      <ReviewItem label="Eligibility" value={data.scheme?.eligibility_criteria || "-"} />
      <ReviewItem label="Description" value={data.scheme?.objective_purpose || "-"} />
      <ReviewItem label="Benefits" value={data.scheme?.nature_of_assistance || "-"} />
      <ReviewItem label="Name" value={data.applicant.name} />
      <ReviewItem label="Date of Birth" value={data.applicant.dob} />
      <ReviewItem label="Email" value={data.applicant.email} />
      <ReviewItem label="Phone" value={data.applicant.phone} />
      <ReviewItem label="Employment Status" value={data.applicant.employment} />
      <ReviewItem label="Skills" value={data.applicant.skills.join(", ")} />

      <div className="flex justify-between mt-6">
        <button
          onClick={() =>
            router.push(
              `/dashboard/returnee/recommended_schemes/apply${data.scheme?.scheme_id ? `?schemeId=${data.scheme.scheme_id}` : ""}`
            )
          }
          className="border px-6 py-2 rounded-md"
        >
          Edit
        </button>

        <button
          onClick={handleApply}
          className="bg-green-700 hover:bg-green-800 text-white px-8 py-2 rounded-md"
        >
          Apply for Scheme
        </button>
      </div>
    </div>
  );
}

function ReviewItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-green-700">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
