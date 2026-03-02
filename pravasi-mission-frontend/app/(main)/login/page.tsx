"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter  } from "next/navigation";
export default function LoginPage() {
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [role, setRole] = useState("returnee");
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange =
    (key: keyof typeof formState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const setCookie = (name: string, value: string, maxAgeSeconds: number) => {
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    setIsSubmitting(true);
    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          email: formState.email.trim(),
          password: formState.password,
        }),
      });

      const resp = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(resp?.message || "Login failed.");
      }

      setSuccessMessage("Login successful.");
      if(resp.success===true){
        const accessToken = resp.data.access_token;
        const refresh_token = resp.data.refresh_token;
        const userDetails = resp.data.user;
        const roleId = resp.data.user.roles[0].role_id;
        const maxAgeSeconds = 60 * 60 * 24 * 7;
        if (accessToken) {
          setCookie("accessToken", accessToken, maxAgeSeconds);
        }
        if (refresh_token) {
          setCookie("refresh_token", refresh_token, maxAgeSeconds);
        }
        if (userDetails) {
          setCookie("userDetails", JSON.stringify(userDetails), maxAgeSeconds);
        }
        if(roleId===1){
          router.push('/dashboard/returnee')
        }
        else if(roleId===2){
          router.push('/dashboard/state')
        }
      }
      console.log("payload===",resp)

    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main className="min-h-screen flex items-center justify-center px-6">

      <div className="w-full max-w-7xl rounded-2xl shadow grid md:grid-cols-2 overflow-hidden">

        {/* L*/}
        <div className="bg-green-800 text-white p-10 flex flex-col justify-between">

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
        <div className="p-10">

          <h2 className="text-2xl font-semibold">
            Login to your account
          </h2>

          
          <div className="flex gap-3 mt-6">
                <button
                    onClick={() => setRole("returnee")}
                    className={`px-5 py-2 rounded-md text-sm border
                    ${role === "returnee"
                        ? "bg-green-700 text-white"
                        : "bg-white text-gray-700"
                    }`}
                >
                    Returnee
                </button>

                <button
                    onClick={() => setRole("district")}
                    className={`px-5 py-2 rounded-md text-sm border
                    ${role === "district"
                        ? "bg-green-700 text-white"
                        : "bg-white text-gray-700"
                    }`}
                >
                    District
                </button>

                <button
                    onClick={() => setRole("state")}
                    className={`px-5 py-2 rounded-md text-sm border
                    ${role === "state"
                        ? "bg-green-700 text-white"
                        : "bg-white text-gray-700"
                    }`}
                >
                    State
                </button>

                </div>

          
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border p-3 rounded-md"
                value={formState.email}
                onChange={handleChange("email")}
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

            <div className="text-right">
              <a href="\forgot-password" className="text-sm text-green-700">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-md font-medium disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

          </form>

          {errorMessage && (
            <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="mt-4 text-sm text-green-700">{successMessage}</p>
          )}

        </div>

      </div>

    </main>
  );
}
