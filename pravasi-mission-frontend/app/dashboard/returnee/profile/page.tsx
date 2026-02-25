"use client";

import { ThemeProvider } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ReturneeProfileResponse = {
  user?: {
    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_country_code?: string;
    phone_number?: string;
  };
  profile?: {
    annual_family_income?: string | number;
    was_nrk_nri?: string;
    work_experience_years?: string | number;
    father_or_guardian_name?: string;
    date_of_birth?: string;
    gender?: string;
    nationality?: string;
    passport_number?: string;
    address_line1?: string;
    address_line2?: string;
    state?: string;
    district?: string;
    pincode?: string;
  };
  support_needed?: Array<{ name?: string }>;
  skill_categories?: Array<{ name?: string }>;
  skills?: Array<{ name?: string }>;
};

type LatestProfileSnapshot = {
  first_name?: string;
  last_name?: string;
  father_or_guardian_name?: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  passport_number?: string;
  phone_number?: string;
  address_line1?: string;
  address_line2?: string;
  state?: string;
  district?: string;
  pincode?: string;
  annual_family_income?: string;
  was_nrk_nri?: string;
  work_experience_years?: string;
  support_needed_names?: string[];
  skill_category_names?: string[];
  skill_names?: string[];
};

const readCookie = (name: string) => {
  const cookieValue = `; ${document.cookie}`;
  const parts = cookieValue.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()?.split(";").shift() ?? "");
  }
  return null;
};

const formatDate = (input?: string) => {
  if (!input) return "dd-mm-yyyy";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const getWorkExperienceLabel = (value?: string | number) => {
  const normalized = value === undefined || value === null ? "" : String(value);
  const map: Record<string, string> = {
    "1": "Less than 1 year",
    "2": "1 - 3 years",
    "3": "3 - 5 years",
    "4": "5 - 10 years",
    "5": "More than 10 years",
  };
  return map[normalized] ?? (normalized || "Select");
};

export default function ViewProfilePage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ReturneeProfileResponse>({});
  const [cookieUser, setCookieUser] = useState<Record<string, unknown> | null>(null);
  const [latestSnapshot, setLatestSnapshot] = useState<LatestProfileSnapshot | null>(null);

  useEffect(() => {
    const userDetailsCookie = readCookie("userDetails");
    if (userDetailsCookie) {
      try {
        setCookieUser(JSON.parse(userDetailsCookie));
      } catch {
        setCookieUser(null);
      }
    }

    const accessToken = readCookie("accessToken");
    if (!baseUrl || !accessToken) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/returnee/profile`, {
          method: "GET",
          cache: "no-store",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          setLoading(false);
          return;
        }

        const data = ((payload as { data?: unknown })?.data ?? payload) as ReturneeProfileResponse;
        setProfileData(data ?? {});
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    const snapshot = window.sessionStorage.getItem("latestReturneeProfile");
    if (snapshot) {
      try {
        setLatestSnapshot(JSON.parse(snapshot) as LatestProfileSnapshot);
      } catch {
        setLatestSnapshot(null);
      }
    }
  }, [baseUrl]);

  const view = useMemo(() => {
    const user = profileData.user ?? {};
    const profile = profileData.profile ?? {};

    const cookieFirstName = typeof cookieUser?.first_name === "string" ? cookieUser.first_name : "";
    const cookieLastName = typeof cookieUser?.last_name === "string" ? cookieUser.last_name : "";
    const cookiePhone = typeof cookieUser?.phone_number === "string" ? cookieUser.phone_number : "";

    const firstName = cookieFirstName || user.first_name || "";
    const lastName = cookieLastName || user.last_name || "";

    const supportNeeded = (profileData.support_needed ?? [])
      .map((item) => item?.name)
      .filter((name): name is string => typeof name === "string" && name.length > 0)
      .join(", ");

    const skillCategories = (profileData.skill_categories ?? [])
      .map((item) => item?.name)
      .filter((name): name is string => typeof name === "string" && name.length > 0)
      .join(", ");

    const specificSkills = (profileData.skills ?? [])
      .map((item) => item?.name)
      .filter((name): name is string => typeof name === "string" && name.length > 0)
      .join(", ");

    const snapshotSupportNeeded =
      Array.isArray(latestSnapshot?.support_needed_names) && latestSnapshot.support_needed_names.length > 0
        ? latestSnapshot.support_needed_names.join(", ")
        : "";
    const snapshotSkillCategories =
      Array.isArray(latestSnapshot?.skill_category_names) && latestSnapshot.skill_category_names.length > 0
        ? latestSnapshot.skill_category_names.join(", ")
        : "";
    const snapshotSkills =
      Array.isArray(latestSnapshot?.skill_names) && latestSnapshot.skill_names.length > 0
        ? latestSnapshot.skill_names.join(", ")
        : "";

    return {
      id: user.id ?? (typeof cookieUser?.id === "string" ? cookieUser.id : ""),
      name: `${latestSnapshot?.first_name || firstName} ${latestSnapshot?.last_name || lastName}`.trim(),
      fatherOrGuardianName: latestSnapshot?.father_or_guardian_name || profile.father_or_guardian_name || "",
      dob: formatDate(latestSnapshot?.date_of_birth || profile.date_of_birth),
      gender: latestSnapshot?.gender || profile.gender || "Select",
      nationality: latestSnapshot?.nationality || profile.nationality || "",
      passportNumber: latestSnapshot?.passport_number || profile.passport_number || "",
      phone:
        [user.phone_country_code, latestSnapshot?.phone_number || cookiePhone || user.phone_number]
          .filter(Boolean)
          .join(" ")
          .trim() ||
        latestSnapshot?.phone_number ||
        cookiePhone ||
        user.phone_number ||
        "",
      address: [latestSnapshot?.address_line1 || profile.address_line1, latestSnapshot?.address_line2 || profile.address_line2]
        .filter(Boolean)
        .join(", ")
        .trim(),
      district: latestSnapshot?.district || profile.district || "",
      state: latestSnapshot?.state || profile.state || "",
      pincode: latestSnapshot?.pincode || profile.pincode || "",
      annualFamilyIncome:
        latestSnapshot?.annual_family_income ||
        (profile.annual_family_income !== undefined && profile.annual_family_income !== null
          ? String(profile.annual_family_income)
          : ""),
      nrkNri: latestSnapshot?.was_nrk_nri || profile.was_nrk_nri || "",
      workExperience: getWorkExperienceLabel(latestSnapshot?.work_experience_years || profile.work_experience_years),
      supportNeeded: snapshotSupportNeeded || supportNeeded || "Select options...",
      skillCategory: snapshotSkillCategories || skillCategories || "Select options...",
      specificSkills: snapshotSkills || specificSkills || "Select options...",
    };
  }, [cookieUser, latestSnapshot, profileData]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white dark:bg-[#111827] rounded-xl shadow p-6 space-y-8">
        <ThemeProvider />

        <div className="flex items-center gap-4">
          <Image src="/avatar.png" alt="Profile" width={64} height={64} className="rounded-full" />
          <div>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {loading ? "" : view.name}
            </h1>
            <p className="text-sm text-green-700">ID: {loading ? "" : view.id}</p>
          </div>
        </div>

        <Section title="Basic Details">
          <Row label="Name" value={loading ? "" : view.name} />
          <Row label="Father's / Guardian's Name" value={loading ? "" : view.fatherOrGuardianName} />
          <Row label="Date of Birth" value={loading ? "" : view.dob} />
          <Row label="Gender" value={loading ? "" : view.gender} />
          <Row label="Nationality" value={loading ? "" : view.nationality} />
          <Row label="Passport Number" value={loading ? "" : view.passportNumber} />
          <Row label="Mobile Number" value={loading ? "" : view.phone} />
        </Section>

        <Section title="Contact Details">
          <Row label="Address" value={loading ? "" : view.address} />
          <Row label="State" value={loading ? "" : view.state} />
          <Row label="District" value={loading ? "" : view.district} />
          <Row label="Pincode" value={loading ? "" : view.pincode} />
        </Section>

        <Section title="Other Details">
          <Row label="Annual Family Income*" value={loading ? "" : view.annualFamilyIncome} />
          <Row label="NRK / NRI" value={loading ? "" : view.nrkNri} />
          <Row label="Work Experience (In years)*" value={loading ? "" : view.workExperience} />
          <Row label="Type of Support Needed*" value={loading ? "" : view.supportNeeded} />
          <Row label="Skill Category" value={loading ? "" : view.skillCategory} />
          <Row label="Specific Skills" value={loading ? "" : view.specificSkills} />
        </Section>

        <div className="flex justify-end">
          <Link href="/dashboard/returnee/profile/edit">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-md">
              Edit
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <p className="text-green-700">{label}</p>
      <p className="text-gray-800 dark:text-gray-100">{value}</p>
    </>
  );
}
