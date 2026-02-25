"use client";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">

      <div className="w-full max-w-6xlrounded-2xl shadow grid md:grid-cols-2 overflow-hidden">

        {/* L*/}
        <div className="bg-green-800 p-10 flex flex-col justify-between">

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

        {/* R*/}
        <div className="p-10 flex flex-col justify-center">

          <h2 className="text-2xl font-semibold">
            Forgot Password
          </h2>

          <form className="mt-6 space-y-5">

            <div>
              <label className="block text-sm mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border p-3 rounded-md"
              />
            </div>

            <div className="text-right">
              <a
                href="/login"
                className="text-sm text-green-700"
              >
                Back to Login
              </a>
            </div>

            <Link href="/reset-password"
                className="block text-center w-full bg-green-700 text-white py-3 rounded-md font-medium"
            >
                Send OTP
            </Link>


          </form>

        </div>

      </div>

    </main>
  );
}
