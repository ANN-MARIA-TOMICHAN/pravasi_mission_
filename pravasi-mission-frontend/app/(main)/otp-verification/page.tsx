"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type PendingSignupOtp = {
  verification_id: string;
  email: string;
  phone_country_code: string;
  phone_number: string;
  first_name?: string;
  last_name?: string;
};

const OTP_LENGTH = 6;

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  if (name.length <= 2) return `${name[0]}***@${domain}`;
  return `${name.slice(0, 2)}***@${domain}`;
}

function maskPhone(phone: string) {
  if (!phone) return "";
  return `******${phone.slice(-4)}`;
}

export default function OTPVerificationPage() {
  const router = useRouter();
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const [context, setContext] = useState<PendingSignupOtp | null>(null);
  const [emailOtp, setEmailOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [phoneOtp, setPhoneOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailOtpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const phoneOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const saved = window.sessionStorage.getItem("pendingSignupOtp");
    if (!saved) {
      setErrorMessage("Signup verification session not found. Please sign up again.");
      return;
    }
    try {
      const parsed = JSON.parse(saved) as PendingSignupOtp;
      setContext(parsed);
    } catch {
      setErrorMessage("Invalid signup verification session. Please sign up again.");
    }
  }, []);

  const setCookie = (name: string, value: string, maxAgeSeconds: number) => {
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;
  };

  const updateOtp =
    (
      value: string,
      index: number,
      otp: string[],
      setOtp: React.Dispatch<React.SetStateAction<string[]>>,
      refs: React.MutableRefObject<(HTMLInputElement | null)[]>
    ) =>
    () => {
      if (!/^\d?$/.test(value)) return;

      const next = [...otp];
      next[index] = value;
      setOtp(next);

      if (value && index < OTP_LENGTH - 1) {
        refs.current[index + 1]?.focus();
      }
    };

  const handleOtpKeyDown =
    (index: number, otp: string[], refs: React.MutableRefObject<(HTMLInputElement | null)[]>) =>
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace" && !otp[index] && index > 0) {
        refs.current[index - 1]?.focus();
      }
    };

  const handleVerify = async () => {
    if (!context) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    const emailOtpCode = emailOtp.join("");
    const phoneOtpCode = phoneOtp.join("");

    if (emailOtpCode.length !== OTP_LENGTH || phoneOtpCode.length !== OTP_LENGTH) {
      setErrorMessage("Please enter both 6-digit OTP codes.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${baseURL}/api/auth/signup/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verification_id: context.verification_id,
          email_otp: emailOtpCode,
          phone_otp: phoneOtpCode,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || "OTP verification failed.");
      }

      const data = payload?.data || {};
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;
      const userDetails = data.user;
      const roleId = Array.isArray(userDetails?.roles) ? userDetails.roles[0]?.role_id : null;
      const maxAgeSeconds = 60 * 60 * 24 * 7;

      if (accessToken) setCookie("accessToken", accessToken, maxAgeSeconds);
      if (refreshToken) setCookie("refresh_token", refreshToken, maxAgeSeconds);
      if (userDetails) setCookie("userDetails", JSON.stringify(userDetails), maxAgeSeconds);

      window.sessionStorage.removeItem("pendingSignupOtp");
      setSuccessMessage("Verification successful. Redirecting...");

      window.setTimeout(() => {
        if (roleId === 1) {
          router.push("/dashboard/returnee");
        } else if (roleId === 2) {
          router.push("/dashboard/state");
        } else {
          router.push("/dashboard/returnee");
        }
      }, 700);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "OTP verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-7xl rounded-2xl shadow grid md:grid-cols-2 overflow-hidden">
        <div className="bg-green-800 text-white p-10 flex flex-col justify-between">
          <div>
            <span className="text-xs bg-green-700 px-3 py-1 rounded-full">
              GOVERNMENT SERVICE
            </span>

            <h2 className="text-3xl font-semibold mt-6">
              Secure & Seamless
              <br />
              Reintegration
            </h2>

            <p className="mt-4 text-green-100 text-sm">
              Access welfare schemes, financial aid and support services
              designed for Non-Resident Keralites.
            </p>
          </div>

          <div className="bg-green-700/60 rounded-lg p-4 text-sm">
            Need Help? <br />
            Call: 1800 123 456 789
          </div>
        </div>

        <div className="p-10">
          <h2 className="text-2xl font-semibold">OTP Verification</h2>
          <p className="text-sm mt-2 text-gray-600">
            Enter the 6-digit OTP sent to phone{" "}
            <b>{context ? maskPhone(context.phone_number) : "******"}</b> and email{" "}
            <b>{context ? maskEmail(context.email) : "***"}</b>.
          </p>

          <div className="space-y-5 mt-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Phone OTP</p>
              <div className="flex gap-2">
                {phoneOtp.map((digit, index) => (
                  <input
                    key={`phone-${index}`}
                    ref={(el) => {
                      phoneOtpRefs.current[index] = el;
                    }}
                    value={digit}
                    maxLength={1}
                    onChange={(event) =>
                      updateOtp(event.target.value, index, phoneOtp, setPhoneOtp, phoneOtpRefs)()
                    }
                    onKeyDown={handleOtpKeyDown(index, phoneOtp, phoneOtpRefs)}
                    className="w-11 h-11 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Email OTP</p>
              <div className="flex gap-2">
                {emailOtp.map((digit, index) => (
                  <input
                    key={`email-${index}`}
                    ref={(el) => {
                      emailOtpRefs.current[index] = el;
                    }}
                    value={digit}
                    maxLength={1}
                    onChange={(event) =>
                      updateOtp(event.target.value, index, emailOtp, setEmailOtp, emailOtpRefs)()
                    }
                    onKeyDown={handleOtpKeyDown(index, emailOtp, emailOtpRefs)}
                    className="w-11 h-11 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                ))}
              </div>
            </div>

            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
            {successMessage && <p className="text-sm text-green-700">{successMessage}</p>}

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="text-sm text-green-700 hover:underline"
              >
                Back to Sign up
              </button>
              <button
                type="button"
                onClick={handleVerify}
                disabled={isSubmitting || !context}
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md disabled:bg-green-300"
              >
                {isSubmitting ? "Verifying..." : "Verify & Create Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
