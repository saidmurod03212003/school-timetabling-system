'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, BookMarked, Calendar, Clock, CheckCheck, X } from 'lucide-react'
import { useOpenLessonsStore } from '@/store/openLessonsStore'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import Link from 'next/link'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Hozir'
  if (mins < 60) return `${mins} daqiqa oldin`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} soat oldin`
  return `${Math.floor(hrs / 24)} kun oldin`
}

export function NotificationBell() {
  const { user } = useAuthStore()
  const { getUnreadCount, getNotificationsForUser, markNotificationRead } =
    useOpenLessonsStore()

  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const teacherEntry = user?.roles?.includes('TEACHER') ? user.id : undefined
  const unreadCount = getUnreadCount(user?.id ?? '', teacherEntry)
  const visibleNotifs = getNotificationsForUser(user?.id ?? '', teacherEntry)
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleMarkRead = (notifId: string) => {
    markNotificationRead(notifId, user?.id ?? '')
  }

  const handleMarkAllRead = () => {
    visibleNotifs
      .filter(n => !n.readBy.includes(user?.id ?? ''))
      .forEach(n => markNotificationRead(n.id, user?.id ?? ''))
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition"
        aria-label="Bildirishnomalar"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-semibold text-gray-900 dark:text-white text-sm">Bildirishnomalar</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Barchasini o&apos;qildi
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {visibleNotifs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Bell className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-sm">Bildirishnoma yo&apos;q</p>
              </div>
            ) : (
              visibleNotifs.map(notif => {
                const isUnread = !notif.readBy.includes(user?.id ?? '')
                const isAssigned = notif.type === 'OPEN_LESSON_ASSIGNED'
                return (
                  <div
                    key={notif.id}
                    className={cn(
                      'flex gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-gray-700 last:border-0 transition',
                      isUnread
                        ? 'bg-indigo-50/60 dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                    )}
                  >
                    {/* Icon */}
                    <div className={cn(
                      'h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                      isAssigned
                        ? 'bg-amber-100 dark:bg-amber-900/30'
                        : 'bg-indigo-100 dark:bg-indigo-900/30'
                    )}>
                      {isAssigned
                        ? <BookMarked className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        : <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      }
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm leading-snug', isUnread ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300')}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeAgo(notif.createdAt)}
                      </p>
                    </div>

                    {/* Mark read */}
                    {isUnread && (
                      <button
                        onClick={() => handleMarkRead(notif.id)}
                        className="flex-shrink-0 mt-0.5 p-1 rounded text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
                        title="O&apos;qildi deb belgilash"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <Link
              href="/open-lessons"
              onClick={() => setOpen(false)}
              className="block text-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition"
            >
              Barcha ochiq darslarni ko&apos;rish &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
