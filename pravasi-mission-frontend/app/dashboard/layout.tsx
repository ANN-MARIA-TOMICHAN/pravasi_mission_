'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'
import Footer from '@/components/Footer';

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react'

import {
  Menu as MenuIcon,
  Search,
  Bird,
  Bell,
  ShoppingCart,
  X,
  LogOut,
  LayoutDashboard,
  Folder,
  FileText,
  User,
  HelpCircle,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard/returnee', icon: LayoutDashboard },
  { label: 'Recommended Schemes', href: '/dashboard/returnee/recommended_schemes', icon: Folder },
  { label: 'Applications', href: '/dashboard/returnee/applications', icon: FileText },
  { label: 'Documents', href: '/dashboard/returnee/documents', icon: FileText },
  { label: 'Profile', href: '/dashboard/returnee/profile', icon: User },
  { label: 'Support', href: '/dashboard/returnee/support', icon: HelpCircle },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { language, toggleLanguage } = useLanguage()
  const profileMenuRef = useRef<HTMLDivElement>(null)

  const clearCookie = (name: string) => {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`
  }

  const handleLogout = () => {
    clearCookie('accessToken')
    clearCookie('refresh_token')
    clearCookie('userDetails')
    setProfileMenuOpen(false)
    router.push('/login')
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false)
      }
    }

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileMenuOpen])

  return (
    <div className="min-h-full h-full bg-gray-100 dark:bg-gray-900">
      <div className="min-h-full">

        {/* ================= MOBILE SIDEBAR ================= */}
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop className="fixed inset-0 bg-black/40" />
          <div className="fixed inset-0 flex">
            <DialogPanel className="relative flex w-full max-w-xs flex-col bg-white dark:bg-gray-900">

              <TransitionChild>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute right-4 top-4 md:hidden"
                >
                  <X className="text-gray-600 dark:text-gray-300" />
                </button>
              </TransitionChild>

              {/* SIDEBAR CONTENT */}
              <div className="flex flex-col h-full">
                <div className="px-6 py-5 text-center border-b border-gray-200 dark:border-gray-700">
                  <Image src="/assets/images/government of kerala.png" alt="Govt" width={128} height={128} className="mx-auto" />
                  <p className="mt-2 text-sm font-regular text-gray-800 dark:text-gray-100">
                    Government of Kerala
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
                    Kerala Pravasi Reintegration & Empowerment Platform
                  </p>
                </div>

                <nav className="mt-4 px-4 flex-1">
                  <ul className="space-y-1">
                    {navItems.map(({ label, href, icon: Icon }) => {
                      const isActive =
                        href === '/dashboard/returnee'
                          ? pathname === href
                          : pathname.startsWith(href)

                      return (
                        <Link key={href} href={href} onClick={() => setSidebarOpen(false)}>
                          <li className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                            isActive 
                              ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white" 
                              : "text-gray-700 hover:bg-green-50 dark:text-green-100 dark:hover:bg-green-700"
                          )}>
                            <Icon size={18} />
                            {label}
                          </li>
                        </Link>
                      )
                    })}
                  </ul>
                </nav>

                <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 w-full rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* ================= DESKTOP SIDEBAR ================= */}
        <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
          {/* SIDEBAR CONTENT */}
          <div className="flex flex-col h-full w-full">
            <div className="px-6 py-5 text-center border-b border-gray-200 dark:border-gray-700">
              <Image src="/assets/images/government of kerala.png" alt="Govt" width={128} height={128} className="mx-auto" />
              <p className="mt-2 text-sm font-regular text-gray-800 dark:text-gray-100">
                Government of Kerala
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
                Kerala Pravasi Reintegration & Empowerment Platform
              </p>
            </div>

            <nav className="mt-4 px-4 flex-1">
              <ul className="space-y-1">
                {navItems.map(({ label, href, icon: Icon }) => {
                  const isActive =
                    href === '/dashboard/returnee'
                      ? pathname === href
                      : pathname.startsWith(href)

                  return (
                    <Link key={href} href={href} onClick={() => setSidebarOpen(false)}>
                      <li className={cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                        isActive 
                          ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white" 
                          : "text-gray-700 hover:bg-green-50 dark:text-green-100 dark:hover:bg-green-700"
                      )}>
                        <Icon size={18} />
                        {label}
                      </li>
                    </Link>
                  )
                })}
              </ul>
            </nav>

            <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 w-full rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* ================= MAIN AREA ================= */}
        <div className="lg:pl-72 min-h-screen flex flex-col">
          {/* HEADER */}
          <header className="px-4 py-3 border-b flex justify-between items-center bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <MenuIcon className="text-green-700 dark:text-green-500" />
            </button>

            <div className="hidden md:flex relative w-80">
              <input
                placeholder='Search (ctrl + "/")'
                className="w-full px-4 py-2 rounded-md bg-green-50 focus:ring-green-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-green-500"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-green-700 dark:text-green-500" />
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <ShoppingCart className="text-gray-600 dark:text-gray-300" />
              <Bird size={16} strokeWidth={0.5} absoluteStrokeWidth />
              <Bell className="text-gray-600 dark:text-gray-300" />
              <button onClick={toggleLanguage} className="text-gray-600 dark:text-gray-300">
                {language === 'en' ? 'EN' : 'മ'}
              </button>
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  className="rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <Image src="/assets/images/user_default.png" alt="Profile" width={32} height={32} className="rounded-full" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg py-1 z-50">
                    <Link
                      href="/dashboard/returnee/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
          <Footer />

        </div>
      </div>
    </div>
  )
}
