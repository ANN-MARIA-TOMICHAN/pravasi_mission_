'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import Image from 'next/image'

import {
  LayoutDashboard,
  FileText,
  Folder,
  User,
  HelpCircle,
  LogOut,
  X,
} from 'lucide-react'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard/returnee',
    icon: LayoutDashboard,
  },
  {
    label: 'Recommended Schemes',
    href: '/dashboard/returnee/recommended_schemes',
    icon: Folder,
  },
  {
    label: 'Applications',
    href: '/dashboard/returnee/applications',
    icon: FileText,
  },
  {
    label: 'Documents',
    href: '/dashboard/returnee/documents',
    icon: FileText,
  },
  {
    label: 'Profile',
    href: '/dashboard/returnee/profile',
    icon: User,
  },
  {
    label: 'Support',
    href: '/dashboard/returnee/support',
    icon: HelpCircle,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-50 md:z-auto top-0 left-0 h-full
        flex flex-col justify-between border-r
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        ${
          isDark
            ? 'bg-gray-900 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        {/* Top */}
        <div>
          <div
            className={`px-6 py-5 flex flex-col items-center text-center gap-2 border-b ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 md:hidden"
            >
              <X
                size={18}
                className={isDark ? 'text-gray-300' : 'text-gray-600'}
              />
            </button>

            <Image
              src="/assets/images/govt.jfif"
              alt="Government Logo"
              width={50}
              height={50}
            />

            <div
              className={`text-sm font-semibold leading-snug ${
                isDark ? 'text-gray-100' : 'text-gray-800'
              }`}
            >
              Kerala Pravasi Reintegration & <br />
              Empowerment Platform
            </div>
          </div>

          {/* Nav */}
          <nav className="mt-4 px-4">
            <ul className="space-y-1">
              {navItems.map(({ label, href, icon: Icon }) => {
                const isActive =
                  href === '/dashboard/returnee'
                    ? pathname === href
                    : pathname === href ||
                      pathname.startsWith(href + '/')

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <li
                      className={`flex items-center gap-3 px-4 py-2 rounded-md
                      cursor-pointer transition
                      ${
                        isActive
                          ? isDark
                            ? 'bg-green-700 text-green-50 font-semibold'
                            : 'bg-green-100 text-green-700 font-semibold'
                          : isDark
                          ? 'text-green-100 hover:bg-green-700'
                          : 'text-gray-700 hover:bg-green-50'
                      }`}
                    >
                      <Icon size={18} />
                      {label}
                    </li>
                  </Link>
                )
              })}
            </ul>
          </nav>
        </div>

        {/* Bottom */}
        <div
          className={`px-4 py-4 border-t ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <button
            className={`flex items-center gap-3 px-4 py-2 w-full rounded-md font-medium transition ${
              isDark
                ? 'text-red-400 hover:bg-red-900/30'
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:pl-64">
        

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
