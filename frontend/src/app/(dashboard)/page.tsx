'use client'

import Link from 'next/link'
import {
  GraduationCap,
  DoorOpen,
  Users,
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface StatCard {
  title: string
  value: string | number
  icon: React.ElementType
  color: string
  change?: string
}

export default function DashboardPage() {
  const { user } = useAuthStore()

  const stats: StatCard[] = [
    { title: "O'qituvchilar",   value: 28,   icon: GraduationCap, color: 'indigo', change: '+3 bu oy' },
    { title: 'Xonalar',         value: 22,   icon: DoorOpen,      color: 'blue',   change: '20 faol' },
    { title: 'Sinflar',         value: 25,   icon: Users,         color: 'green',  change: "750 o'quvchi" },
    { title: 'Fanlar',          value: 16,   icon: BookOpen,      color: 'purple', change: '14 asosiy' },
    { title: "O'quv rejalar",   value: 25,   icon: BookOpen,      color: 'teal',   change: 'Barcha sinflar' },
    { title: 'Jadval sifati',   value: '92%',icon: TrendingUp,    color: 'amber',  change: 'Yaxshi daraja' },
  ]

  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400',
    blue:   'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
    green:  'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
    amber:  'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400',
    teal:   'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Xush kelibsiz, {user?.fullName?.split(' ')[0]}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Maktab dars jadvali boshqaruv tizimi
        </p>
      </div>

      {/* Quick alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              Jadval nashr etildi
            </p>
            <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">
              2025-2026 o&apos;quv yili 1-semestr jadvali nashr etildi
            </p>
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Yangi o&apos;quv yili boshlanmoqda
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
              2025-2026 o&apos;quv yili jadvali tayyor
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
                {stat.change && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stat.change}
                  </p>
                )}
              </div>
              <div className={`rounded-xl p-3 ${colorMap[stat.color]}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tezkor amallar
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Jadval yaratish',  href: '/timetable/generate', color: 'bg-indigo-600 hover:bg-indigo-700' },
            { label: "O'qituvchilar",    href: '/teachers',           color: 'bg-blue-600 hover:bg-blue-700' },
            { label: "O'quv reja",       href: '/curriculum',         color: 'bg-green-600 hover:bg-green-700' },
            { label: 'Fanlar',           href: '/subjects',           color: 'bg-purple-600 hover:bg-purple-700' },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`${action.color} text-white text-sm font-medium text-center py-3 px-4 rounded-lg transition`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
