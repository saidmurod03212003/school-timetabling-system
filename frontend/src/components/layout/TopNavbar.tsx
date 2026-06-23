'use client'

import { Moon, Sun, LogOut, ChevronDown, User, Menu } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/lib/api/auth'
import { useState } from 'react'
import { NotificationBell } from '@/components/notifications/NotificationBell'

interface TopNavbarProps {
  onToggleSidebar: () => void
}

export function TopNavbar({ onToggleSidebar }: TopNavbarProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { user, refreshToken, logout } = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(refreshToken!),
    onSuccess: () => { logout(); router.push('/login') },
    onError:   () => { logout(); router.push('/login') },
  })

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 shrink-0">
      {/* Left: hamburger */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition"
        aria-label="Menyu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <NotificationBell />

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">{user?.fullName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{user?.roles?.[0]}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 py-1">
                <a
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="h-4 w-4" />
                  Profil sozlamalari
                </a>
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                  Chiqish
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
