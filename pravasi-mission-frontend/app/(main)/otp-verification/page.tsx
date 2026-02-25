 "use client";

// import { useState, useRef } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { ArrowLeft, Lock } from "lucide-react";

 export default function OTPVerificationPage() {
//   const router = useRouter();
//   const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
// //   otp stored as 6digit otp ["1", "4", "9", "2", "7", "6"]
//   const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
// //   references to each inp box- auto focusing next inp

//   function handleChange(value: string, index: number) {
//     if (!/^\d?$/.test(value)) return;
//     // handling otp inp -allow only 0-9 no leter or symbol

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);
//     // otp update

//     if (value && index < 5) {
//       inputsRef.current[index + 1]?.focus();
//     }
//   }

//   function handleVerify() {
//     const enteredOtp = otp.join("");

//     if (enteredOtp.length !== 6) {
//       alert("Please enter the complete OTP");
//       return;
//     }

//     // 👉 API verification goes here later

//     router.push("/dashboard/returnee"); // redirect after success
//   }
return(
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

    </div>
)
//   return (
//     <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

//       {/* LEFT SECTION */}
//       <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-green-700 to-emerald-900 text-white">

//         <div className="flex items-center gap-2 font-semibold">
//           <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
//             🌍
//           </div>
//           NORKA Roots
//         </div>

//         <div>
//           <h1 className="text-3xl font-semibold leading-snug">
//             Connecting Global Keralites<br />to Their Roots
//           </h1>

//           <p className="mt-4 text-sm text-green-100 max-w-md">
//             Secure, efficient, and transparent services for the welfare of
//             Non-Resident Keralites. Verify your identity to access your
//             personalized dashboard.
//           </p>

//           <div className="flex gap-10 mt-8 text-sm">
//             <div>
//               <p className="text-2xl font-bold">4M+</p>
//               <p className="text-green-200">Registered NRKs</p>
//             </div>
//             <div>
//               <p className="text-2xl font-bold">24/7</p>
//               <p className="text-green-200">Support Services</p>
//             </div>
//           </div>
//         </div>

//         <div />
//       </div>

//       {/* RIGHT SECTION */}
//       <div className="flex items-center justify-center px-6">
//         <div className="w-full max-w-md space-y-6">

//           {/* Back */}
//           <button
//             onClick={() => router.push("/login")}
//             className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-700"
//           >
//             <ArrowLeft size={16} /> Back to Login
//           </button>

//           {/* Icon */}
//           <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
//             <Lock className="text-green-700" />
//           </div>

//           <h2 className="text-2xl font-semibold text-gray-800">
//             Verify Your Identity
//           </h2>

//           <p className="text-sm text-gray-600">
//             We sent a 6-digit code to <b>+91 ******9887</b>.  
//             Please enter it below to secure your account.
//           </p>

//           <button className="text-sm text-green-700 hover:underline">
//             Change phone number
//           </button>

//           {/* OTP INPUT */}
//           <div className="flex gap-3 justify-center mt-4">
//             {otp.map((digit, index) => (
//               <input
//                 key={index}
//                 ref={(el) => (inputsRef.current[index] = el)}
//                 value={digit}
//                 onChange={(e) => handleChange(e.target.value, index)}
//                 maxLength={1}
//                 className="w-12 h-12 text-center text-lg border rounded-md
//                   focus:outline-none focus:ring-2 focus:ring-green-600"
//               />
//             ))}
//           </div>

//           <p className="text-xs text-gray-500">
//             ⏱ Code expires in <span className="text-green-700">01:59</span>
//           </p>

//           <p className="text-xs text-gray-500">
//             Didn’t receive code?{" "}
//             <button className="text-green-700 hover:underline">
//               Resend OTP
//             </button>
//           </p>

//           {/* VERIFY BUTTON */}
//           <button
//             onClick={handleVerify}
//             className="w-full bg-lime-500 hover:bg-lime-600
//               text-white py-3 rounded-full font-medium transition"
//           >
//             Verify & Proceed →
//           </button>

//           <p className="text-xs text-center text-gray-500">
//             Need help? <span className="text-green-700">Contact Support</span>
//           </p>

//         </div>
//       </div>
//     </div>
   //);
 }
