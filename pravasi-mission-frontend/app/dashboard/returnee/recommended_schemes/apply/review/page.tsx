"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ApplySchemeData = {
  name: string;
  dob: string;
  email: string;
  phone: string;
  employment: string;
  skills: string[];
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

      <ReviewItem label="Name" value={data.name} />
      <ReviewItem label="Date of Birth" value={data.dob} />
      <ReviewItem label="Email" value={data.email} />
      <ReviewItem label="Phone" value={data.phone} />
      <ReviewItem label="Employment Status" value={data.employment} />
      <ReviewItem label="Skills" value={data.skills.join(", ")} />

      <div className="flex justify-between mt-6">
        <button
          onClick={() =>
            router.push(
              "/dashboard/returnee/recommended_schemes/apply"
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
