"use client";

import { useLanguage } from "@/context/LanguageContext";
import { FileText, Briefcase, Layers, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function ReturneeDashboardPage() {
  const { language } = useLanguage();
  const [displayName, setDisplayName] = useState("User");

  useEffect(() => {
    const readCookie = (name: string) => {
      const cookieValue = `; ${document.cookie}`;
      const parts = cookieValue.split(`; ${name}=`);
      if (parts.length === 2) {
        return decodeURIComponent(parts.pop()?.split(";").shift() ?? "");
      }
      return null;
    };

    const userDetailsCookie = readCookie("userDetails");
    if (!userDetailsCookie) return;

    try {
      const parsed = JSON.parse(userDetailsCookie) as { first_name?: string; last_name?: string };
      const fullName = [parsed.first_name, parsed.last_name].filter(Boolean).join(" ").trim();
      if (fullName) {
        setDisplayName(fullName);
      }
    } catch {
      setDisplayName("User");
    }
  }, []);

  const t = useMemo(
    () => ({
      heading: language === "en" ? `Welcome back, ${displayName}` : `തിരികെ സ്വാഗതം, ${displayName}`,
      subheading:
        language === "en"
          ? "Here is what's happening with your applications today"
          : "ഇന്ന് നിങ്ങളുടെ അപേക്ഷകളിലെ പുതുക്കലുകൾ ഇവയാണ്",
      bannerWelcome: language === "en" ? `Welcome ${displayName}` : `${displayName}, സ്വാഗതം`,
      bannerTitle:
        language === "en"
          ? "21 Returnees are registered from your state"
          : "നിങ്ങളുടെ സംസ്ഥാനത്ത് 21 പ്രവാസികൾ രജിസ്റ്റർ ചെയ്തിട്ടുണ്ട്",
      bannerDesc:
        language === "en"
          ? "You are almost there, add your employment history to unlock personalized job recommendations and faster processing."
          : "നിങ്ങൾ ലക്ഷ്യത്തിനു സമീപമാണ്. ജോലി പരിചയം ചേർത്താൽ വ്യക്തിഗത ജോലി നിർദേശങ്ങളും വേഗത്തിലുള്ള പ്രോസസ്സിംഗും ലഭിക്കും.",
      joinCommunity: language === "en" ? "Join Malayalee Communities" : "മലയാളി കമ്മ്യൂണിറ്റികളിൽ ചേരുക",
      completeProfile: language === "en" ? "Complete Profile" : "പ്രൊഫൈൽ പൂർത്തിയാക്കുക",
      pendingApplications: language === "en" ? "Pending Applications" : "കാത്തിരിക്കുന്ന അപേക്ഷകൾ",
      newJobMatches: language === "en" ? "New Job Matches" : "പുതിയ ജോലി പൊരുത്തങ്ങൾ",
      totalApplications: language === "en" ? "Total Applications" : "ആകെ അപേക്ഷകൾ",
      approved: language === "en" ? "Approved" : "അംഗീകരിച്ചത്",
      recommendedSchemes: language === "en" ? "Recommended Schemes" : "ശുപാർശ ചെയ്യുന്ന പദ്ധതികൾ",
      schemeSubtitle:
        language === "en"
          ? "NORKA Department Project for Returned Employees"
          : "മടങ്ങിയെത്തിയ പ്രവാസികൾക്കായുള്ള നോർക്ക വകുപ്പ് പദ്ധതി",
      subsidy: language === "en" ? "Up to 30 Lakhs subsidy" : "30 ലക്ഷം വരെ സബ്സിഡി",
      applyNow: language === "en" ? "Apply Now" : "ഇപ്പോൾ അപേക്ഷിക്കുക",
      govtAnnouncements: language === "en" ? "Govt Announcements" : "സർക്കാർ അറിയിപ്പുകൾ",
      today: language === "en" ? "Today" : "ഇന്ന്",
      todayNews:
        language === "en"
          ? "New subsidy rates announced for women entrepreneurs under NDPREM scheme."
          : "NDPREM പദ്ധതിയിൽ വനിത സംരംഭകർക്ക് പുതിയ സബ്സിഡി നിരക്കുകൾ പ്രഖ്യാപിച്ചു.",
      yesterday: language === "en" ? "Yesterday" : "ഇന്നലെ",
      yesterdayNews:
        language === "en"
          ? "Special job fair for returnees in Kochi on Nov 15th. Register now."
          : "കൊച്ചിയിൽ നവംബർ 15ന് മടങ്ങിയെത്തിയ പ്രവാസികൾക്കായി പ്രത്യേക ജോബ് ഫെയർ. ഇപ്പോൾ രജിസ്റ്റർ ചെയ്യൂ.",
      readAllNews: language === "en" ? "Read all news" : "എല്ലാ വാർത്തകളും വായിക്കുക",
    }),
    [displayName, language]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{t.heading}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.subheading}</p>
      </div>

      <div
        className="relative overflow-hidden rounded-xl bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/images/dash1.png')",
        }}
      >
        <div className="absolute inset-0 " />

        <div className="relative z-10 flex flex-col gap-4 p-6 text-white">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <div>
              <p className="text-sm opacity-90">{t.bannerWelcome}</p>
              <h2 className="mt-1 text-small">
                {t.bannerTitle}
              </h2>
              <p className="mt-2 max-w-xl text-sm opacity-80">
                {t.bannerDesc}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <button className="rounded-md border border-white/70 px-4 py-1 text-sm hover:bg-white/10">
                {t.joinCommunity}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-1.5 flex-1 rounded-bl-full">
              <div className="h-full w-1/3 rounded-full bg-green-700" />
            </div>
            <Link href="/dashboard/returnee/profile">
              <button className="rounded-md bg-green-700 px-5 py-1.5 text-sm font-medium text-white hover:bg-green-900">
                {t.completeProfile}
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <FileText className="text-green-600" size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t.pendingApplications}</p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">2935</h3>
          </div>
        </div>

        <div className="flex gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <Briefcase className="text-blue-600" size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t.newJobMatches}</p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">29</h3>
          </div>
        </div>

        <div className="flex gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
            <Layers className="text-purple-600" size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t.totalApplications}</p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">23</h3>
          </div>
        </div>

        <div className="flex gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
            <CheckCircle className="text-orange-600" size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t.approved}</p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">2</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t.recommendedSchemes}</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-white p-5 shadow-sm dark:bg-gray-800">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">NDPREM Business Loan</h3>
              <p className="mt-1 text-sm text-gray-500">{t.schemeSubtitle}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">{t.subsidy}</span>
                <Link href="/dashboard/returnee/recommended_schemes/apply">
                  <button className="rounded-md bg-green-800 px-4 py-1.5 text-sm text-white transition hover:bg-green-900">
                    {t.applyNow}
                  </button>
                </Link>
              </div>
            </div>

            <div className="rounded-lg bg-white p-5 shadow-sm dark:bg-gray-800">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">NDPREM Business Loan</h3>
              <p className="mt-1 text-sm text-gray-500">{t.schemeSubtitle}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">{t.subsidy}</span>
                <Link href="/dashboard/returnee/recommended_schemes/apply">
                  <button className="rounded-md bg-green-800 px-4 py-1.5 text-sm text-white transition hover:bg-green-900">
                    {t.applyNow}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-green-800 p-5 text-white">
          <h3 className="font-semibold">{t.govtAnnouncements}</h3>

          <ul className="mt-4 space-y-3 text-sm">
            <li>
              {t.today}
              <br />
              {t.todayNews}
            </li>
            <li>
              {t.yesterday}
              <br />
              {t.yesterdayNews}
            </li>
          </ul>

          <button className="mt-4 text-sm underline">{t.readAllNews}</button>
        </div>
      </div>
    </div>
  );
}
