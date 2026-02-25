"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type ApplicationDetails = {
  application_number: string;
  scheme_name: string;
  description: string;
  eligibility: string;
  benefits: string;

  name: string;
  dob: string;
  email: string;
  phone: string;
  employment_status: string;
  skills: string;
};

export default function ApplicationDetailsPage() {
  const params = useParams();
  const applicationId = params?.applicationId as string;

  const [data, setData] = useState<ApplicationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!applicationId) return;

    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ CSR fetch (runs in browser)
        const res = await fetch(`/api/scheme-applications/${applicationId}`, {
          method: "GET",
          cache: "no-store",
          signal: ac.signal,
        });

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Failed to load application details");
        }

        const json = (await res.json()) as ApplicationDetails;
        setData(json);
      } catch (e: any) {
        if (e?.name !== "AbortError") setError(e?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [applicationId]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-0">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Scheme Application Details</h1>
        <p className="text-sm text-gray-500 mt-1">
          Based on your NRK profile, here are the welfare programs you match with
        </p>
      </div>

      <div className="bg-white border rounded-lg p-6 text-sm">
        <h2 className="text-sm font-semibold mb-4">Scheme Details</h2>

        {loading ? (
          <p className="text-sm text-gray-500">Loading details…</p>
        ) : error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : !data ? (
          <p className="text-sm text-gray-500">No data found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Info label="Application Number" value={data.application_number} />
            <Info label="Scheme Name" value={data.scheme_name} />

            <Info label="Description" value={data.description} />
            <Info label="Eligibility" value={data.eligibility} />
            <Info label="Benefits" value={data.benefits} />

            <Info label="Name" value={data.name} />
            <Info label="Date of Birth" value={data.dob} />
            <Info label="Email" value={data.email} />
            <Info label="Phone" value={data.phone} />
            <Info label="Current Employment Status" value={data.employment_status} />
            <Info label="Skills" value={data.skills} />
          </div>
        )}
      </div>

      <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <Image src="/assets/images/duk.png" alt="DUK" width={120} height={40} />

        <p className="text-center">
          Designed, Developed and Implemented by Centre for Digital Innovation and Product Development (CDIPD) <br />
          A Centre of Excellence Established by Digital University Kerala
        </p>

        <Image src="/assets/images/cdipd.png" alt="CDIPD" width={120} height={40} />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-green-700">{label}</p>
      <p className="font-medium text-gray-800 mt-0.5 break-words">{value}</p>
    </div>
  );
}
