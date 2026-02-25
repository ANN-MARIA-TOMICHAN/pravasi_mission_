"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";


type ApplySchemeFormData = {
  name: string;
  dob: string;
  email: string;
  phone: string;
  employment: string;
  skills: string[];
};


export default function ApplySchemeFormPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<ApplySchemeFormData>({
    name: "",
    dob: "",
    email: "",
    phone: "",
    employment: "",
    skills: [],
  });

  const employmentOptions = [
    "Unemployed",
    "Self Employed",
    "Employed",
    "Student",
  ];

  const skillOptions = [
    "Java",
    "Python",
    "SQL",
    "React",
    "Node.js",
  ];

  
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
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
    localStorage.setItem(
      "applySchemeData",
      JSON.stringify(formData)
    );

    router.push("/dashboard/returnee/recommended_schemes/apply/review");
  }

  
  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-0">

     
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Apply for Scheme
        </h1>
        <p className="text-sm text-green-700 dark:text-gray-400 mt-1">
          Review the scheme details and submit your application
        </p>
      </div>

      
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md">

        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Scheme Details
          </h2>
        </div>

        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <Info
            label="Scheme Name"
            value="Reintegration Support Scheme"
          />

          <Info
            label="Eligibility"
            value="Returnee Non-Resident Keralites seeking employment or entrepreneurship support."
          />

          <Info
            label="Description"
            value="Provides financial assistance, skill development, and employment facilitation for returnees."
          />

          <Info
            label="Benefits"
            value="Subsidy up to ₹30 Lakhs, training programs, employment guidance, and government support."
          />
        </div>
      </div>

     {/* ----------------------------------- */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md">

        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Applicant Details
          </h2>
        </div>

        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

          <Input label="Full Name" name="name" onChange={handleChange} />
          <Input label="Date of Birth" name="dob" type="date" onChange={handleChange} />
          <Input label="Email" name="email" type="email" onChange={handleChange} />
          <Input label="Phone" name="phone" onChange={handleChange} />

          
          <div>
            <label className="text-xs text-green-700 dark:text-gray-400">
              Employment Status
            </label>
            <select
              name="employment"
              onChange={handleChange}
              className="mt-1 w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800"
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
            <label className="text-xs text-green-700 dark:text-gray-400">
              Skills
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => handleSkillChange(skill)}
                  className={`px-3 py-1 rounded-full text-xs border transition
                    ${
                      formData.skills.includes(skill)
                        ? "bg-green-700 text-white"
                        : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
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
          className="bg-green-700 hover:bg-green-800 text-white px-10 py-2 rounded-md transition">
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
  onChange,
}: {
  label: string;
  name: keyof ApplySchemeFormData;
  type?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}) {
  return (
    <div>
      <label className="text-xs text-green-700 dark:text-gray-400">
        {label}
      </label>
      <input
        name={name}
        type={type}
        onChange={onChange}
        className="mt-1 w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800"
      />
    </div>
  );
}

function Info({
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
      <p className="text-gray-800 dark:text-gray-100 font-medium mt-1">
        {value}
      </p>
    </div>
  );
}
