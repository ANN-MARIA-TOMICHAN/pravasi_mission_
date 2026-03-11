"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { useProfileImage } from "@/lib/profileImage";

type FormState = {
  firstName: string;
  lastName: string;
  fatherOrGuardianName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  passportNumber: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  district: string;
  pincode: string;
  annualFamilyIncome: string;
  nrkNri: string;
  workExperience: string;
  supportNeeded: Array<string | number>;
};

type SupportType = { id?: string | number; name?: string };
type SkillCategory = { id?: string | number; name?: string; label?: string; title?: string };
type SkillOption = { id?: string | number; name: string };
type ReturneeProfileResponse = {
  user?: {
    id?: string;
    first_name?: string;
    last_name?: string;
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
  support_needed?: Array<{ id?: string | number }>;
  skill_categories?: Array<{ name?: string }>;
  skills?: Array<{ id?: string | number; name?: string }>;
};

export default function EditProfilePage() {
  const router = useRouter();
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const { profileImage, setProfileImage } = useProfileImage("/assets/images/user_default.png");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<Record<string, unknown> | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [userId, setUserId] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>({
    firstName: "",
    lastName: "",
    fatherOrGuardianName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    passportNumber: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    state: "",
    district: "",
    pincode: "",
    annualFamilyIncome: "",
    nrkNri: "NRK",
    workExperience: "",
    supportNeeded: [],
  });

  const [supportTypes, setSupportTypes] = useState<SupportType[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [specificSkills, setSpecificSkills] = useState<string[]>([]);
  const [specificSkillOptions, setSpecificSkillOptions] = useState<SkillOption[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [pendingSelectedSkillIds, setPendingSelectedSkillIds] = useState<Array<string | number>>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const options=[
              { label: "Less than 1 year", value: 1 },
              { label: "1 - 3 years", value: 2 },
              { label: "3 - 5 years", value: 3 },
              { label: "5 - 10 years", value: 4 },
              { label: "More than 10 years", value: 5 }
            ]
  useEffect(() => {
    const readCookie = (name: string) => {
      const cookieValue = `; ${document.cookie}`;
      const parts = cookieValue.split(`; ${name}=`);
      if (parts.length === 2) {
        return decodeURIComponent(parts.pop()?.split(";").shift() ?? "");
      }
      return null;
    };

    const accessTokenCookie = readCookie("accessToken");
    const refreshTokenCookie = readCookie("refresh_token");
    const userDetailsCookie = readCookie("userDetails");

    setAccessToken(accessTokenCookie);
    setRefreshToken(refreshTokenCookie);

    if (!userDetailsCookie) return;

    try {
      const parsed = JSON.parse(userDetailsCookie);
      setUserDetails(parsed);
      setUserId(parsed.id)
      setFormState((prev) => ({
        ...prev,
        firstName: typeof parsed?.first_name === "string" ? parsed.first_name : prev.firstName,
        lastName: typeof parsed?.last_name === "string" ? parsed.last_name : prev.lastName,
        fatherOrGuardianName:
          typeof parsed?.father_or_guardian_name === "string"
            ? parsed.father_or_guardian_name
            : prev.fatherOrGuardianName,
        dateOfBirth:
          typeof parsed?.date_of_birth === "string" ? parsed.date_of_birth : prev.dateOfBirth,
        gender: typeof parsed?.gender === "string" ? parsed.gender : prev.gender,
        nationality: typeof parsed?.nationality === "string" ? parsed.nationality : prev.nationality,
        passportNumber:
          typeof parsed?.passport_number === "string"
            ? parsed.passport_number
            : prev.passportNumber,
        phoneNumber:
          typeof parsed?.phone_number === "string" ? parsed.phone_number : prev.phoneNumber,
        addressLine1:
          typeof parsed?.address_line1 === "string"
            ? parsed.address_line1
            : typeof parsed?.address_line_1 === "string"
              ? parsed.address_line_1
              : prev.addressLine1,
        addressLine2:
          typeof parsed?.address_line2 === "string"
            ? parsed.address_line2
            : typeof parsed?.address_line_2 === "string"
              ? parsed.address_line_2
              : prev.addressLine2,
        state: typeof parsed?.state === "string" ? parsed.state : prev.state,
        district: typeof parsed?.district === "string" ? parsed.district : prev.district,
        pincode: typeof parsed?.pincode === "string" ? parsed.pincode : prev.pincode,
        annualFamilyIncome:
          typeof parsed?.annual_family_income === "string"
            ? parsed.annual_family_income
            : prev.annualFamilyIncome,
        nrkNri:
          typeof parsed?.was_nrk_nri === "string"
            ? parsed.was_nrk_nri
            : typeof parsed?.nrk_nri === "string"
              ? parsed.nrk_nri
              : prev.nrkNri,
        workExperience:
          typeof parsed?.work_experience_years === "string"
            ? parsed.work_experience_years
            : typeof parsed?.work_experience === "string"
              ? parsed.work_experience
              : prev.workExperience,
      }));
    } catch {
      setUserDetails(null);
    }
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!baseUrl || !accessToken) return;

      try {
        const headers: Record<string, string> = {
          Authorization: `Bearer ${accessToken}`,
        };
        if (userId) {
          headers["x-user-id"] = userId;
        }

        const response = await fetch(`${baseUrl}/api/returnee/profile`, {
          method: "GET",
          headers,
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error((payload as { message?: string })?.message || "Failed to load profile.");
        }

        const data = ((payload as { data?: unknown })?.data ?? payload) as ReturneeProfileResponse;
        const user = data?.user ?? {};
        const profile = data?.profile ?? {};

        setFormState((prev) => ({
          ...prev,
          firstName: typeof user.first_name === "string" ? user.first_name : prev.firstName,
          lastName: typeof user.last_name === "string" ? user.last_name : prev.lastName,
          fatherOrGuardianName:
            typeof profile.father_or_guardian_name === "string"
              ? profile.father_or_guardian_name
              : prev.fatherOrGuardianName,
          dateOfBirth:
            typeof profile.date_of_birth === "string" ? profile.date_of_birth : prev.dateOfBirth,
          gender: typeof profile.gender === "string" ? profile.gender : prev.gender,
          nationality: typeof profile.nationality === "string" ? profile.nationality : prev.nationality,
          passportNumber:
            typeof profile.passport_number === "string" ? profile.passport_number : prev.passportNumber,
          phoneNumber:
            typeof user.phone_number === "string" ? user.phone_number : prev.phoneNumber,
          addressLine1:
            typeof profile.address_line1 === "string" ? profile.address_line1 : prev.addressLine1,
          addressLine2:
            typeof profile.address_line2 === "string" ? profile.address_line2 : prev.addressLine2,
          state: typeof profile.state === "string" ? profile.state : prev.state,
          district: typeof profile.district === "string" ? profile.district : prev.district,
          pincode: typeof profile.pincode === "string" ? profile.pincode : prev.pincode,
          annualFamilyIncome:
            profile.annual_family_income !== undefined && profile.annual_family_income !== null
              ? String(profile.annual_family_income)
              : prev.annualFamilyIncome,
          nrkNri: typeof profile.was_nrk_nri === "string" ? profile.was_nrk_nri : prev.nrkNri,
          workExperience:
            profile.work_experience_years !== undefined && profile.work_experience_years !== null
              ? String(profile.work_experience_years)
              : prev.workExperience,
          supportNeeded: Array.isArray(data?.support_needed)
            ? data.support_needed
                .map((item) => item?.id)
                .filter((id): id is string | number => id !== undefined && id !== null)
            : prev.supportNeeded,
        }));

        if (typeof user.id === "string" && user.id.length > 0) {
          setUserId(user.id);
        }

        setSelectedCategories(
          Array.isArray(data?.skill_categories)
            ? data.skill_categories
                .map((category) => category?.name)
                .filter((name): name is string => typeof name === "string" && name.length > 0)
            : []
        );

        setSelectedSkills(
          Array.isArray(data?.skills)
            ? data.skills
                .map((skill) => skill?.name)
                .filter((name): name is string => typeof name === "string" && name.length > 0)
            : []
        );

        setPendingSelectedSkillIds(
          Array.isArray(data?.skills)
            ? data.skills
                .map((skill) => skill?.id)
                .filter((id): id is string | number => id !== undefined && id !== null)
            : []
        );
      } catch (error) {
        console.error(error);
      }
    };

    loadProfile();
  }, [accessToken, baseUrl, userId]);

  const fetchMasterData = async (endpoint: string) => {
    if (!baseUrl) return [];
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    const response = await fetch(`${baseUrl}${endpoint}`, { headers });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error((payload as { message?: string })?.message || "Failed to load master data.");
    }
    return (payload as { data?: unknown })?.data ?? payload;
  };

  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const [support, categories] = await Promise.all([
          fetchMasterData("/api/master/support-types"),
          fetchMasterData("/api/master/skill-categories"),
        ]);
        setSupportTypes(Array.isArray(support) ? (support as SupportType[]) : []);
        setSkillCategories(Array.isArray(categories) ? (categories as SkillCategory[]) : []);
        setSpecificSkills([]);
        setSpecificSkillOptions([]);
      } catch (error) {
        console.error(error);
      }
    };

    loadMasterData();
  }, [accessToken, baseUrl]);

  const handleInputChange =
    (key: keyof Omit<FormState, "supportNeeded">) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleSelectChange =
    (key: "gender" | "workExperience") =>
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setFormState((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const getSupportLabel = (support: SupportType) => support.name ?? "";
  const getSupportValue = (support: SupportType) => support.id ?? "";
  const getCategoryLabel = (category: SkillCategory) =>
    category.name ?? category.label ?? category.title ?? "";

  const toggleSupportNeeded = (support: SupportType) => {
    const value = getSupportValue(support);
    if (value === "") return;
    setFormState((prev) => ({
      ...prev,
      supportNeeded: prev.supportNeeded.includes(value)
        ? prev.supportNeeded.filter((item) => item !== value)
        : [...prev.supportNeeded, value],
    }));
  };

  useEffect(() => {
    const loadSkillsByCategory = async () => {
      const selectedCategoryIds = selectedCategories
        .map((name) => {
          const match = skillCategories.find((category) => getCategoryLabel(category) === name);
          return match?.id ?? "";
        })
        .filter((id): id is string | number => id !== "" && id !== null && id !== undefined);

      if (selectedCategoryIds.length === 0) {
        setSpecificSkills([]);
        setSpecificSkillOptions([]);
        return;
      }

      try {
        const params = new URLSearchParams();
        selectedCategoryIds.forEach((id) => {
          params.append("category_ids", String(id));
        });
        const skills = await fetchMasterData(`/api/master/skills?${params.toString()}`);
        const normalizedSkills = (Array.isArray(skills) ? skills : [])
          .map((skill) => {
            if (typeof skill === "string") {
              return { id: undefined, name: skill } as SkillOption;
            }
            if (skill && typeof skill === "object") {
              const record = skill as {
                id?: string | number;
                skill_id?: string | number;
                name?: string;
                label?: string;
                title?: string;
              };
              const name = record.name ?? record.label ?? record.title ?? "";
              if (!name) return null;
              return { id: record.id ?? record.skill_id, name } as SkillOption;
            }
            return null;
          })
          .filter((skill): skill is SkillOption => Boolean(skill));

        setSpecificSkillOptions(normalizedSkills);
        setSpecificSkills(normalizedSkills.map((skill) => skill.name));
      } catch (error) {
        console.error(error);
      }
    };

    loadSkillsByCategory();
  }, [accessToken, baseUrl, selectedCategories, skillCategories]);

  useEffect(() => {
    setSelectedSkills((prev) =>
      prev.filter((selected) => specificSkillOptions.some((skill) => skill.name === selected))
    );
  }, [specificSkillOptions]);

  useEffect(() => {
    if (pendingSelectedSkillIds.length === 0 || specificSkillOptions.length === 0) return;

    const pendingIdSet = new Set(pendingSelectedSkillIds.map((id) => String(id)));
    const mappedSkillNames = specificSkillOptions
      .filter((skill) => skill.id !== undefined && pendingIdSet.has(String(skill.id)))
      .map((skill) => skill.name);

    if (mappedSkillNames.length > 0) {
      setSelectedSkills(mappedSkillNames);
    }

    setPendingSelectedSkillIds([]);
  }, [pendingSelectedSkillIds, specificSkillOptions]);

  useEffect(() => {
    if (!saveSuccess) {
      setShowSuccessToast(false);
      return;
    }

    setShowSuccessToast(true);
    const timer = window.setTimeout(() => {
      setShowSuccessToast(false);
      setSaveSuccess(null);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [saveSuccess]);

  const skillCategoryOptions = skillCategories
    .map((category) => getCategoryLabel(category))
    .filter((name) => name.length > 0);

  const handleProfileImageUpload: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!baseUrl) {
      setSaveError("Base URL is not configured.");
      setSaveSuccess(null);
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    const selectedCategoryIds = selectedCategories
      .map((name) => {
        const match = skillCategories.find((category) => getCategoryLabel(category) === name);
        return match?.id;
      })
      .filter((id): id is string | number => id !== undefined && id !== null);

    const selectedSkillIds = selectedSkills
      .map((selectedSkill) => {
        const match = specificSkillOptions.find((skill) => skill.name === selectedSkill);
        return match?.id;
      })
      .filter((id): id is string | number => id !== undefined && id !== null);

    const payload = {
      first_name: formState.firstName,
      last_name: formState.lastName,
      father_or_guardian_name: formState.fatherOrGuardianName,
      date_of_birth: formState.dateOfBirth,
      gender: formState.gender,
      nationality: formState.nationality,
      passport_number: formState.passportNumber,
      phone_number: formState.phoneNumber,
      id_document_url: documentFile ? documentFile.name : null,
      address_line1: formState.addressLine1,
      address_line2: formState.addressLine2,
      state: formState.state,
      district: formState.district,
      pincode: formState.pincode,
      annual_family_income: formState.annualFamilyIncome,
      was_nrk_nri: formState.nrkNri,
      work_experience_years: formState.workExperience,
      support_type_ids: formState.supportNeeded,
      skill_category_ids: selectedCategoryIds,
      skill_ids: selectedSkillIds,
    };

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(`${baseUrl}/api/returnee/profile/basic`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "x-user-id" :userId
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((result as { message?: string })?.message || "Failed to save profile.");
      }

      const maxAgeSeconds = 60 * 60 * 24 * 7;
      const updatedUserDetails = {
        ...(userDetails ?? {}),
        id: userId ?? (userDetails as { id?: string } | null)?.id ?? "",
        first_name: formState.firstName,
        last_name: formState.lastName,
        phone_number: formState.phoneNumber,
      };
      document.cookie = `userDetails=${encodeURIComponent(
        JSON.stringify(updatedUserDetails)
      )}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;
      window.dispatchEvent(new Event("user-details-updated"));
      setUserDetails(updatedUserDetails);

      const latestProfileSnapshot = {
        first_name: formState.firstName,
        last_name: formState.lastName,
        father_or_guardian_name: formState.fatherOrGuardianName,
        date_of_birth: formState.dateOfBirth,
        gender: formState.gender,
        nationality: formState.nationality,
        passport_number: formState.passportNumber,
        phone_number: formState.phoneNumber,
        address_line1: formState.addressLine1,
        address_line2: formState.addressLine2,
        state: formState.state,
        district: formState.district,
        pincode: formState.pincode,
        annual_family_income: formState.annualFamilyIncome,
        was_nrk_nri: formState.nrkNri,
        work_experience_years: formState.workExperience,
        support_needed_names: supportTypes
          .filter((item) => formState.supportNeeded.includes(getSupportValue(item)))
          .map((item) => getSupportLabel(item))
          .filter((item) => item.length > 0),
        skill_category_names: selectedCategories,
        skill_names: selectedSkills,
      };
      window.sessionStorage.setItem("latestReturneeProfile", JSON.stringify(latestProfileSnapshot));

      setSaveSuccess("Profile saved successfully.");
      window.setTimeout(() => {
        router.push("/dashboard/returnee/profile");
      }, 1000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-white dark:bg-[#111827] rounded-xl shadow-sm dark:shadow-none border border-transparent dark:border-gray-800 p-6 space-y-10">
        <div>
          <div className="mb-5 flex items-center gap-4">
            <div className="relative">
              <Image
                src={profileImage}
                alt="Profile"
                width={64}
                height={64}
                unoptimized={profileImage.startsWith("data:")}
                className="rounded-full object-cover w-16 h-16 border border-gray-300 dark:border-gray-700"
              />
              <button
                type="button"
                onClick={() => profileFileInputRef.current?.click()}
                className="absolute -right-1 -bottom-1 rounded-full bg-green-700 text-white p-1.5 hover:bg-green-800"
                aria-label="Upload profile image"
                title="Upload profile image"
              >
                <Pencil size={12} />
              </button>
              <input
                ref={profileFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageUpload}
              />
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                {[formState.firstName, formState.lastName].filter(Boolean).join(" ") || "Profile"}
              </h1>
              <p className="text-sm text-green-700">ID: {userId ?? "--"}</p>
            </div>
          </div>

          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Profile</h1>
          <p className="text-sm text-green-700 mt-1">
            Please enter your basic identification exactly as it appears on your passport. This
            will be used to verify your identity.
          </p>
        </div>

        <Section title="Basic Identification">
          <p className="text-sm text-green-700 max-w-2xl">
            Please enter your basic identification exactly as it appears on your passport. This
            will be used to verify your identity.
          </p>

          <hr className="border-gray-200 dark:border-gray-700 my-5" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="First Name" value={formState.firstName} onChange={handleInputChange("firstName")} />
            <Input label="Last Name" value={formState.lastName} onChange={handleInputChange("lastName")} />

            <Input
              label="Father's / Guardian's Name"
              value={formState.fatherOrGuardianName}
              onChange={handleInputChange("fatherOrGuardianName")}
            />
            <Input label="Date of Birth" type="date" value={formState.dateOfBirth} onChange={handleInputChange("dateOfBirth")} />

            <Select
              label="Gender"
              options={["Male", "Female", "Other"]}
              value={formState.gender}
              onChange={handleSelectChange("gender")}
            />

            <Input label="Nationality" value={formState.nationality} onChange={handleInputChange("nationality")} />
            <Input label="Passport Number" value={formState.passportNumber} onChange={handleInputChange("passportNumber")} />
            <Input label="Mobile Number" value={formState.phoneNumber} onChange={handleInputChange("phoneNumber")} />

            <FileInput
              label="Upload Document"
              full
              onChange={(event) => {
                const selectedFile = event.target.files?.[0] ?? null;
                setDocumentFile(selectedFile);
              }}
            />
          </div>
        </Section>

        <Section title="Contact Details">
          <p className="text-sm text-green-700">Please enter your contact details.</p>

          <hr className="border-gray-200 dark:border-gray-700 my-5" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Address Line 1" value={formState.addressLine1} onChange={handleInputChange("addressLine1")} />
            <Input label="Address Line 2" value={formState.addressLine2} onChange={handleInputChange("addressLine2")} />
            <Input label="State" value={formState.state} onChange={handleInputChange("state")} />
            <Input label="District" value={formState.district} onChange={handleInputChange("district")} />
            <Input label="Pincode" value={formState.pincode} onChange={handleInputChange("pincode")} />
          </div>
        </Section>

        <Section title="Other Details">
          <p className="text-sm text-green-700">Please provide other details.</p>

          <hr className="border-gray-200 dark:border-gray-700 my-5" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Annual Family Income*"
              type="number"
              value={formState.annualFamilyIncome}
              onChange={handleInputChange("annualFamilyIncome")}
            />

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm text-gray-700 dark:text-gray-300">Please indicate whether you were an NRK/NRI*</label>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md px-4 py-3 cursor-pointer w-full">
                  <input
                    type="radio"
                    name="nrk_nri"
                    className="accent-green-600"
                    checked={formState.nrkNri === "NRK"}
                    onChange={() => setFormState((prev) => ({ ...prev, nrkNri: "NRK" }))}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">NRK</span>
                </label>

                <label className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md px-4 py-3 cursor-pointer w-full">
                  <input
                    type="radio"
                    name="nrk_nri"
                    className="accent-green-600"
                    checked={formState.nrkNri === "NRI"}
                    onChange={() => setFormState((prev) => ({ ...prev, nrkNri: "NRI" }))}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">NRI</span>
                </label>
              </div>
            </div>
              <div className="flex flex-col gap-2 w-full">
  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
    Work Experience (In years)*
  </label>
            <select value={formState.workExperience} 
            className="
      w-full
      px-4 py-2
      border border-gray-300 dark:border-gray-700
      rounded-lg
      bg-white dark:bg-gray-900
      text-gray-700 dark:text-gray-100
      shadow-sm dark:shadow-none
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      focus:border-blue-500
      transition
      duration-200
    "
            onChange={handleSelectChange("workExperience")}>
            <option value="">Select</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm text-gray-700 dark:text-gray-300">Type of Support Needed*</label>

              <div className="border border-gray-300 dark:border-gray-700 rounded-md p-4 space-y-3 bg-transparent dark:bg-gray-900">
                {supportTypes.length === 0 ? (
                  <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
                ) : (
                  supportTypes.map((support) => {
                    const value = getSupportValue(support);
                    const label = getSupportLabel(support);
                    return (
                      <label key={String(value || label)} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="accent-green-600"
                          checked={formState.supportNeeded.includes(value)}
                          disabled={value === ""}
                          onChange={() => toggleSupportNeeded(support)}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            <MultiSelect
              label="Skill Category"
              options={skillCategoryOptions}
              value={selectedCategories}
              onChange={setSelectedCategories}
            />

            <MultiSelect
              label="Specific Skills"
              options={specificSkills}
              value={selectedSkills}
              onChange={setSelectedSkills}
            />
          </div>
        </Section>

        <div className="space-y-2">
          {saveError && <p className="text-sm text-red-600">{saveError}</p>}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white px-10 py-2 rounded-md text-sm"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {showSuccessToast && saveSuccess && (
          <div className="fixed right-4 top-4 z-50 rounded-md bg-emerald-600 px-4 py-3 text-sm text-white shadow-lg">
            {saveSuccess}
          </div>
        )}
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
    <section className="space-y-2">
      <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
      {children}
    </section>
  );
}

function Input({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type={type}
        className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-green-600"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function Select({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-700 dark:text-gray-300">{label}</label>
      <select
        className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-green-600"
        value={value ?? ""}
        onChange={onChange}
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function MultiSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="flex flex-col gap-1 relative" ref={containerRef}>
      <label className="text-sm text-gray-700 dark:text-gray-300">{label}</label>

      <div
        className={`
          border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm
          bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100
          min-h-[38px] cursor-pointer flex items-center justify-between
          focus:outline-none focus:ring-1 focus:ring-green-600
          ${open ? "ring-1 ring-green-600" : ""}
        `}
        onClick={() => setOpen(!open)}
        tabIndex={0}
      >
        {value.length === 0 ? (
          <span className="text-gray-400 dark:text-gray-500">Select options...</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {value.map((v) => (
              <span
                key={v}
                className="bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1"
              >
                {v}
                <button
                  type="button"
                  className="text-green-700 hover:text-red-600 focus:outline-none text-sm leading-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(value.filter((item) => item !== v));
                  }}
                >
                  x
                </button>
              </span>
            ))}
          </div>
        )}
        <span className="text-gray-500 dark:text-gray-400 text-xs">v</span>
      </div>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto divide-y divide-gray-100 dark:divide-gray-800">
          {options.map((option) => {
            const isSelected = value.includes(option);
            return (
              <div
                key={option}
                className={`
                  px-4 py-2.5 text-sm cursor-pointer
                  hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-800
                  ${isSelected ? "bg-green-50 dark:bg-green-900/20" : ""}
                `}
                onClick={() => toggleOption(option)}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className="accent-green-600 w-4 h-4 pointer-events-none"
                  />
                  <span>{option}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FileInput({
  label,
  full = false,
  onChange,
}: {
  label: string;
  full?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className={`flex flex-col gap-1 ${full ? "md:col-span-2" : ""}`}>
      <label className="text-sm text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type="file"
        onChange={onChange}
        className="
          w-full text-sm
          border border-gray-300 dark:border-gray-700 rounded-md
          bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100
          px-3 py-2
          file:mr-3
          file:rounded-md
          file:border-0
          file:bg-green-100 dark:file:bg-green-900/40
          file:text-gray-700 dark:file:text-green-200
          file:px-4
          file:py-1.5
          file:text-sm
          cursor-pointer
          hover:file:bg-green-200
        "
      />
    </div>
  );
}
