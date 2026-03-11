"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const baseURL=process.env.NEXT_PUBLIC_BASE_URL
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState(1);
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange =
    (key: keyof typeof formState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (formState.password !== formState.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!baseURL) {
        throw new Error("NEXT_PUBLIC_BASE_URL is not configured.");
      }

      const roles=[role]
      const response = await fetch(`${baseURL}/api/auth/signup/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formState.email.trim().toLowerCase(),
          role_ids:roles,
          first_name: formState.firstName.trim(),
          last_name: formState.lastName.trim(),
          email: formState.email.trim(),
          phone_number: formState.phoneNumber.trim(),
          password: formState.password,
          phone_country_code:'+91'
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || "Signup failed.");
      }

      const identifier = payload?.data?.identifier;
      const verificationId = payload?.data?.verification_id;
      if (!identifier) {
        throw new Error("OTP identifier could not be created.");
      }

      const otpContext = {
        verification_id: verificationId,
        identifier,
        role_ids: roles,
        email: formState.email.trim(),
        phone_country_code: "+91",
        phone_number: formState.phoneNumber.trim(),
        first_name: formState.firstName.trim(),
        last_name: formState.lastName.trim(),
        password: formState.password,
      };
      window.sessionStorage.setItem("pendingSignupOtp", JSON.stringify(otpContext));

      setSuccessMessage("OTP sent successfully. Redirecting to verification...");
      setFormState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });
      window.setTimeout(() => {
        router.push("/otp-verification");
      }, 500);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Signup failed.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
    <div className="w-full max-w-7xl grid md:grid-cols-2 rounded-2xl shadow overflow-hidden">

      {/* L  */}
        <div className="bg-green-800 text-white p-10 flex flex-col justify-between">

          <div>
            <span className="text-xs bg-green-700 px-3 py-1 ">
              GOVERNMENT SERVICE
            </span>

            <h2 className="text-3xl font-semibold mt-6">
              Secure & Seamless<br />Reintegration
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


      {/* RIGHT */}
      <div className="p-10">
        <h2 className="text-2xl font-semibold">Create Account</h2>

        <p className="text-sm mt-1">
          Please select your role and fill in the details
          <br/>
          I am registering as
        </p>

        <div className="grid grid-cols-3 gap-4 mt-6">

  <button
    onClick={() => setRole(1)}
    className={`rounded-lg p-4 text-center border
      ${role === 1
        ? "bg-green-700 text-amber-50"
        : "border-gray-200"
      }`}
  >
    <div className="font-medium">Returnee</div>
    <p className="text-xs mt-1">
      Reintegrating to Kerala
    </p>
  </button>

  <button
    onClick={() => setRole(2)}
    className={`rounded-lg p-4 text-center border
      ${role === 2
        ? " bg-green-700 text-amber-50"
        : "border-gray-200"
      }`}
  >
    <div className="font-medium">Association</div>
    <p className="text-xs mt-1">
      NRI Organization
    </p>
  </button>

  <button
    onClick={() => setRole(3)}
    className={`rounded-lg p-4 text-center border
      ${role === 3
        ? " bg-green-700 text-amber-50"
        : "border-gray-200"
      }`}
  >
    <div className="font-medium">Volunteer</div>
    <p className="text-xs  mt-1">
      Supporting Welfare
    </p>
  </button>

</div>



        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <input
              className="border p-3 rounded-md"
              placeholder="First Name"
              value={formState.firstName}
              onChange={handleChange("firstName")}
              required
            />
            <input
              className="border p-3 rounded-md"
              placeholder="Last Name"
              value={formState.lastName}
              onChange={handleChange("lastName")}
              required
            />
          </div>

          <input
            className="border p-3 rounded-md w-full"
            placeholder="Email"
            type="email"
            value={formState.email}
            onChange={handleChange("email")}
            required
          />

          <div className="flex">
            <span className="bg-green-700 px-3 py-3 rounded-l-md text-sm text-amber-50">
              +91
            </span>
            <input
              className="border p-3 rounded-r-md w-full"
              placeholder="Mobile Number"
              value={formState.phoneNumber}
              onChange={handleChange("phoneNumber")}
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="border p-3 rounded-md w-full pr-10"
              value={formState.password}
              onChange={handleChange("password")}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="border p-3 rounded-md w-full pr-10"
              value={formState.confirmPassword}
              onChange={handleChange("confirmPassword")}
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-sm text-green-700">{successMessage}</p>
          )}

          <button
            className="w-full bg-green-700 text-amber-50 py-3 rounded-md disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-green-700 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
    </main>
  );
}
