"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type ApplySchemeFormData = {
  name: string;
  dob: string;
  email: string;
  phone: string;
  employment: string;
  skills: string[];
};

type SchemeRecord = {
  scheme_id?: number;
  scheme_name?: string;
  objective_purpose?: string;
  eligibility_criteria?: string;
  nature_of_assistance?: string;
  target_beneficiaries?: string;
  scheme_type_name?: string;
  category_name?: string;
  skill_sector?: string;
};

type ApplySchemePayload = {
  scheme: SchemeRecord | null;
  applicant: ApplySchemeFormData;
};

const readCookie = (name: string) => {
  const cookieValue = `; ${document.cookie}`;
  const parts = cookieValue.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()?.split(";").shift() ?? "");
  }
  return null;
};

export default function ApplySchemeFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const schemeId = searchParams.get("schemeId");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [loadingScheme, setLoadingScheme] = useState(true);
  const [scheme, setScheme] = useState<SchemeRecord | null>(null);

  const [formData, setFormData] = useState<ApplySchemeFormData>({
    name: "",
    dob: "",
    email: "",
    phone: "",
    employment: "",
    skills: [],
  });

  const employmentOptions = ["Unemployed", "Self Employed", "Employed", "Student"];
  const skillOptions = ["Java", "Python", "SQL", "React", "Node.js"];

  useEffect(() => {
    const userDetailsCookie = readCookie("userDetails");
    if (!userDetailsCookie) return;

    try {
      const parsed = JSON.parse(userDetailsCookie) as {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone_number?: string;
      };
      const fullName = [parsed.first_name, parsed.last_name].filter(Boolean).join(" ").trim();

      setFormData((prev) => ({
        ...prev,
        name: fullName || prev.name,
        email: parsed.email || prev.email,
        phone: parsed.phone_number || prev.phone,
      }));
    } catch {}
  }, []);

  useEffect(() => {
    if (!baseUrl || !schemeId) {
      setLoadingScheme(false);
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
        setLoadingScheme(false);
      }
    };

    loadScheme();
  }, [baseUrl, schemeId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSkillChange(skill: string) {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  }

  function handleSave() {
    const payload: ApplySchemePayload = {
      scheme,
      applicant: formData,
    };

    localStorage.setItem("applySchemeData", JSON.stringify(payload));
    router.push("/dashboard/returnee/recommended_schemes/apply/review");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-0">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Apply for Scheme</h1>
        <p className="mt-1 text-sm text-green-700 dark:text-gray-400">
          Review the scheme details and submit your application
        </p>
      </div>

      <div className="rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-6 py-3 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Scheme Details</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 px-6 py-4 text-sm md:grid-cols-2">
          {loadingScheme ? (
            <p className="text-sm text-gray-500">Loading scheme details...</p>
          ) : (
            <>
              <Info label="Scheme Name" value={scheme?.scheme_name || "-"} />
              <Info label="Eligibility" value={scheme?.eligibility_criteria || "-"} />
              <Info label="Description" value={scheme?.objective_purpose || "-"} />
              <Info label="Benefits" value={scheme?.nature_of_assistance || "-"} />
              <Info label="Target Beneficiaries" value={scheme?.target_beneficiaries || "-"} />
              <Info
                label="Category"
                value={scheme?.scheme_type_name || scheme?.category_name || scheme?.skill_sector || "-"}
              />
            </>
          )}
        </div>
      </div>

      <div className="rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-6 py-3 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Applicant Details</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 px-6 py-4 text-sm md:grid-cols-2">
          <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
          <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
          <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
          <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />

          <div>
            <label className="text-xs text-green-700 dark:text-gray-400">Employment Status</label>
            <select
              name="employment"
              value={formData.employment}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-800"
            >
              <option value="">Select</option>
              {employmentOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-green-700 dark:text-gray-400">Skills</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => handleSkillChange(skill)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    formData.skills.includes(skill)
                      ? "bg-green-700 text-white"
                      : "border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-md bg-green-700 px-10 py-2 text-white transition hover:bg-green-800"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  name: keyof ApplySchemeFormData;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  return (
    <div>
      <label className="text-xs text-green-700 dark:text-gray-400">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="mt-1 w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-800"
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-green-700 dark:text-gray-400">{label}</p>
      <p className="mt-1 font-medium text-gray-800 dark:text-gray-100">{value}</p>
    </div>
  );
}
