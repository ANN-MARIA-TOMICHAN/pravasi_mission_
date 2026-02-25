"use client";

import Image from "next/image";
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

function generateApplicationId() {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `RS-${year}-${random}`;
}

export default function ApplySchemeSuccessPage() {
  const router = useRouter();

  const [data] = useState<ApplySchemeData | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("applySchemeData");
    return saved ? JSON.parse(saved) : null;
  });

  const applicationId = generateApplicationId();
  const submissionDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!data) {
    return (
      <p className="text-sm text-gray-500">
        No application data found.
      </p>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 sm:px-0">

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">

        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Application Submitted Successfully!
        </h1>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Your application for the Returnee Support Scheme has been successfully
          submitted. You will receive an email confirmation shortly.
        </p>

        <div className="mt-6 border-t pt-6 text-left">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Application Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

            <SummaryItem label="Application ID" value={applicationId} />
            <SummaryItem label="Scheme Name" value="Returnee Support Scheme" />
            <SummaryItem label="Applicant Name" value={data.name} />
            <SummaryItem label="Submission Date" value={submissionDate} />
            <SummaryItem label="Employment Status" value={data.employment} />
            <SummaryItem label="Skills" value={data.skills.join(", ")} />

          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">

          <button
            onClick={() =>
              router.push("/dashboard/returnee/applications")
            }
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md text-sm"
          >
            View Application Status
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("applySchemeData");
              router.push("/dashboard/returnee");
            }}
            className="border border-gray-300 hover:bg-gray-100 px-6 py-2 rounded-md text-sm"
          >
            Return to Dashboard
          </button>

        </div>
      </div>

      <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">

        <Image
          src="/assets/images/duk.png"
          alt="Digital University Kerala"
          width={120}
          height={40}
        />

        <p className="text-center">
          Designed, Developed and Implemented by Centre for Digital Innovation and
          Product Development (CDIPD) <br />
          A Centre of Excellence Established by Digital University Kerala
        </p>

        <Image
          src="/assets/images/cdipd.png"
          alt="CDIPD"
          width={120}
          height={40}
        />
      </div>

    </div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-green-700 dark:text-gray-400">
        {label}
      </p>
      <p className="font-medium text-gray-800 dark:text-gray-100">
        {value}
      </p>
    </div>
  );
}
