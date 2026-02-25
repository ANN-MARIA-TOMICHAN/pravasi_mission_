"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">

      <div className="w-full max-w-6xl rounded-2xl shadow grid md:grid-cols-2 overflow-hidden">

        {/* L*/}
        <div className="bg-green-800  p-10 flex flex-col justify-between">

          <div>
            <span className="text-xs bg-green-700 px-3 py-1 rounded-full">
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

        {/* R */}
        <div className="p-10 flex flex-col justify-center">

          <h2 className="text-2xl font-semibold">
            Forgot Password
          </h2>

          <form className="mt-6 space-y-5">

            <div>
                <label className="block text-sm mb-1">
                    Enter New Password
                </label>

                <div className="relative">
                    <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••"
                    className="w-full border p-3 rounded-md pr-10"
                    />

                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 "
                    >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm mb-1">
                    Confirm Password
                </label>

                <div className="relative">
                    <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••"
                    className="w-full border p-3 rounded-md pr-10"
                    />

                    <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 "
                    >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>



            <div className="text-right">
              <a
                href="/login"
                className="text-sm text-green-700"
              >
                Back to Login
              </a>
            </div>

            <button
              type="button"
              className="w-full bg-green-700  py-3 rounded-md font-medium"
            >
              Change Password
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}
