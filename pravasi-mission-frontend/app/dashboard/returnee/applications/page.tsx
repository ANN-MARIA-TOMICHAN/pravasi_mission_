"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type Application = {
  id: string;
  scheme: string;
  date: string;
  status: "Success" | "Pending" | "Rejected";
};

export default function ApplicationsPage() {
  const [search, setSearch] = useState("");

  const applications: Application[] = [
    {
      id: "APP20240001",
      scheme: "Financial Assistance for Returnees",
      date: "2024-07-26",
      status: "Success",
    },
    {
      id: "APP20240002",
      scheme: "Skill Development Program",
      date: "2024-07-20",
      status: "Pending",
    },
    {
      id: "APP20240003",
      scheme: "Entrepreneurship Support",
      date: "2024-07-15",
      status: "Rejected",
    },
    {
      id: "APP20240004",
      scheme: "Housing Assistance",
      date: "2024-07-10",
      status: "Success",
    },
    {
      id: "APP20240005",
      scheme: "Medical Support",
      date: "2024-07-05",
      status: "Pending",
    },
  ];

  const filtered = applications.filter((app) =>
    app.id.toLowerCase().includes(search.toLowerCase())
  );
{/*filter loops thru all applctns--- includes matches pakthy text*/}

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Application Status List
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          View your application details here
        </p>
      </div>

      
      <div className="relative max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by application number"
          className="w-full pl-9 pr-3 py-2 border rounded-md text-sm
                     bg-white dark:bg-gray-900
                     text-gray-800 dark:text-gray-100"
        />
      </div>

      
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="text-left px-4 py-3">Application Number</th>
              <th className="text-left px-4 py-3">Scheme</th>
              <th className="text-left px-4 py-3">Submitted Date</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-center px-4 py-3">View Details</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((app) => (
              <tr
                key={app.id}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="px-4 py-3">{app.id}</td>
                <td className="px-4 py-3 text-green-700">
                  {app.scheme}
                </td>
                <td className="px-4 py-3">{app.date}</td>

                <td className="px-4 py-3">
                  <StatusBadge status={app.status} />
                </td>

                <td className="px-4 py-3 text-center">
                  <button className="bg-green-700 hover:bg-green-800 text-white text-xs px-4 py-1.5 rounded-md">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}


function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Success: "bg-green-100 text-green-700",
    Pending: "bg-gray-100 text-gray-600",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
