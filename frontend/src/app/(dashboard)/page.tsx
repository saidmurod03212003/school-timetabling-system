'use client'

import Link from 'next/link'
import {
  GraduationCap,
  DoorOpen,
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BookMarked,
  Bell,
  Clock,
  Timer,
  ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useOpenLessonsStore } from '@/store/openLessonsStore'

interface StatCard {
  title: string
  value: string | number
  icon: React.ElementType
  color: string
  change?: string
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { lessons, getUnreadCount } = useOpenLessonsStore()

  const isTeacher = user?.roles?.includes('TEACHER')

  const myOpenLessons = isTeacher
    ? lessons.filter(l => l.teacherId === user?.id && l.status !== 'COMPLETED')
    : []

  const upcomingLessons = lessons
    .filter(l => l.status === 'UPCOMING')
    .slice(0, 3)

  const unreadCount = getUnreadCount(user?.id ?? '', isTeacher ? user?.id : undefined)

  const stats: StatCard[] = [
    { title: "O'qituvchilar",   value: 48,   icon: GraduationCap, color: 'indigo', change: '+3 bu oy' },
    { title: 'Xonalar',         value: 32,   icon: DoorOpen,      color: 'blue',   change: '28 faol' },
    { title: 'Sinflar',         value: 24,   icon: Users,         color: 'green',  change: "720 o'quvchi" },
    { title: 'Fanlar',          value: 15,   icon: BookOpen,      color: 'purple', change: '12 asosiy' },
    { title: 'Jadval sifati',   value: '87%',icon: TrendingUp,    color: 'amber',  change: 'Yaxshi daraja' },
    { title: 'Ochiq darslar',   value: lessons.filter(l => l.status === 'UPCOMING').length, icon: BookMarked, color: 'teal', change: `${lessons.length} jami` },
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

      {/* Teacher open lesson notification banner */}
      {isTeacher && myOpenLessons.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-300 dark:border-amber-700 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
              <BookMarked className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 dark:text-amber-300 text-base">
                Sizda {myOpenLessons.length} ta ochiq dars bor!
              </h3>
              <div className="mt-2 space-y-2">
                {myOpenLessons.map(l => (
                  <div key={l.id} className="flex flex-wrap items-center gap-3 text-sm text-amber-800 dark:text-amber-400">
                    <span className="font-medium">• {l.title}</span>
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-500">
                      <Calendar className="h-3.5 w-3.5" />
                      {l.date}
                    </span>
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-500">
                      <Clock className="h-3.5 w-3.5" />
                      {l.startTime}–{l.endTime}
                    </span>
                    {l.classroom && (
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-500">
                        <DoorOpen className="h-3.5 w-3.5" />
                        {l.classroom}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <Link
                href="/open-lessons"
                className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 transition"
              >
                Batafsil ko'rish
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Unread notifications banner */}
      {unreadCount > 0 && !isTeacher && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
            <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
              {unreadCount} ta yangi bildirishnoma bor
            </p>
            <p className="text-xs text-indigo-600 dark:text-indigo-500 mt-0.5">
              Ochiq darslar haqida yangiliklar
            </p>
          </div>
          <Link
            href="/open-lessons"
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap"
          >
            Ko'rish →
          </Link>
        </div>
      )}

      {/* Quick alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              Jadval nashr etildi
            </p>
            <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">
              2024-2025 o&apos;quv yili 1-semestr jadvali nashr etildi
            </p>
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Diqqat: 3 ta o&apos;qituvchi mavjudligi ko&apos;rsatilmagan
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
              Yangi jadval yaratishdan oldin yangilang
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

      {/* Upcoming open lessons */}
      {upcomingLessons.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Timer className="h-5 w-5 text-indigo-500" />
              Kelayotgan ochiq darslar
            </h2>
            <Link
              href="/open-lessons"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Barchasini ko'rish →
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingLessons.map(lesson => (
              <div
                key={lesson.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition"
              >
                <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                  <BookMarked className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{lesson.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {lesson.teacherName} · {lesson.subjectName}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{lesson.date}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{lesson.startTime}–{lesson.endTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tezkor amallar
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Jadval yaratish', href: '/timetable/generate', color: 'bg-indigo-600 hover:bg-indigo-700' },
            { label: "O'qituvchilar",   href: '/teachers',           color: 'bg-blue-600 hover:bg-blue-700' },
            { label: 'Ochiq darslar',   href: '/open-lessons',       color: 'bg-amber-600 hover:bg-amber-700' },
            { label: 'Fanlar',          href: '/subjects',            color: 'bg-purple-600 hover:bg-purple-700' },
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
