'use client'

import { useQuery } from '@tanstack/react-query'
import { Calendar, Plus, Eye, Zap } from 'lucide-react'
import Link from 'next/link'
import apiClient from '@/lib/api/client'
import { useAuthStore } from '@/store/authStore'
import type { ApiResponse } from '@/types/api.types'
import type { Timetable } from '@/types/timetable.types'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT:      { label: 'Qoralama',    color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  GENERATING: { label: 'Yaratilmoqda',color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  GENERATED:  { label: 'Yaratildi',   color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  PUBLISHED:  { label: 'Nashr etildi',color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  ARCHIVED:   { label: 'Arxivlandi',  color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  FAILED:     { label: 'Xato',        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
}

export default function TimetableListPage() {
  const { user } = useAuthStore()
  const schoolId = user?.schoolId || ''

  const { data: timetables = [], isLoading } = useQuery<Timetable[]>({
    queryKey: ['timetables', schoolId],
    queryFn: async () => {
      if (!schoolId) return []
      const res = await apiClient.get<ApiResponse<Timetable[]>>(`/schools/${schoolId}/timetables`)
      return res.data.data ?? []
    },
    enabled: !!schoolId,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dars jadvallari</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Barcha jadvallar ro'yxati</p>
        </div>
        <Link
          href="/timetable/generate"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="h-4 w-4" /> Yangi jadval
        </Link>
      </div>

      {!schoolId && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 text-amber-800 dark:text-amber-300 text-sm">
          Jadvallarni ko'rish uchun maktab tanlash kerak. Administrator sifatida kirganingizda schoolId bo'sh.
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : timetables.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Calendar className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-lg font-medium">Jadval topilmadi</p>
          <p className="text-sm mt-1 mb-4">Yangi jadval yaratish uchun tugmani bosing</p>
          <Link
            href="/timetable/generate"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
          >
            <Zap className="h-4 w-4" /> Jadval yaratish
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {timetables.map(t => {
            const st = STATUS_LABELS[t.status] ?? STATUS_LABELS.DRAFT
            return (
              <div key={t.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-2">
                    <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${st.color}`}>{st.label}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{t.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  {new Date(t.createdAt).toLocaleDateString('uz-UZ')}
                </p>
                <Link
                  href={`/timetable/${t.id}`}
                  className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium"
                >
                  <Eye className="h-4 w-4" /> Ko'rish
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
