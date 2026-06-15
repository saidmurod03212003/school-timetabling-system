'use client'

import { useState } from 'react'
import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, User, DoorOpen, CheckCircle2, Loader2 } from 'lucide-react'
import apiClient from '@/lib/api/client'
import { useAuthStore } from '@/store/authStore'
import type { ApiResponse } from '@/types/api.types'
import { cn } from '@/lib/utils'

interface EntryDto {
  id: string
  studentClassId: string
  className: string
  subjectId: string
  subjectName: string
  subjectColor: string
  teacherId: string
  teacherName: string
  classroomId: string
  classroomName: string
  dayOfWeek: string
  periodNumber: number
  startTime: string
  endTime: string
}

interface TimetableInfo {
  id: string
  name: string
  status: string
  createdAt: string
}

interface LessonPeriod {
  id: string
  periodNumber: number
  startTime: string
  endTime: string
}

const DAYS: { key: string; label: string }[] = [
  { key: 'MONDAY',    label: 'Dushanba' },
  { key: 'TUESDAY',   label: 'Seshanba' },
  { key: 'WEDNESDAY', label: 'Chorshanba' },
  { key: 'THURSDAY',  label: 'Payshanba' },
  { key: 'FRIDAY',    label: 'Juma' },
]

const STATUS_LABELS: Record<string, string> = {
  DRAFT:     "Qoralama",
  GENERATED: "Yaratilgan",
  PUBLISHED: "Nashr etilgan",
  ARCHIVED:  "Arxiv",
}

const SUBJECT_COLORS = [
  'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200',
  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
  'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
  'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200',
  'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200',
  'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-200',
  'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
  'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200',
  'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200',
  'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200',
  'bg-lime-100 text-lime-800 dark:bg-lime-900/50 dark:text-lime-200',
  'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/50 dark:text-fuchsia-200',
]

function subjectColorClass(subjectId: string): string {
  let hash = 0
  for (let i = 0; i < subjectId.length; i++) hash = (hash * 31 + subjectId.charCodeAt(i)) >>> 0
  return SUBJECT_COLORS[hash % SUBJECT_COLORS.length]
}

function breakMinutes(endTime: string, nextStartTime: string): number {
  const [eh, em] = endTime.split(':').map(Number)
  const [sh, sm] = nextStartTime.split(':').map(Number)
  return (sh * 60 + sm) - (eh * 60 + em)
}

function formatTime(t: string): string {
  return t.substring(0, 5) // "HH:MM"
}

export default function TimetableDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuthStore()
  const schoolId = user?.schoolId ?? ''
  const [selectedClassId, setSelectedClassId] = useState<string>('')

  // Fetch timetable info
  const { data: timetable } = useQuery<TimetableInfo>({
    queryKey: ['timetable', schoolId, id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<TimetableInfo>>(
        `/schools/${schoolId}/timetables/${id}`
      )
      return res.data.data!
    },
    enabled: !!schoolId,
  })

  // Fetch all entries
  const { data: entries = [], isLoading: entriesLoading } = useQuery<EntryDto[]>({
    queryKey: ['timetable-entries', schoolId, id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<EntryDto[]>>(
        `/schools/${schoolId}/timetables/${id}/entries`
      )
      return res.data.data ?? []
    },
    enabled: !!schoolId,
  })

  // Fetch lesson periods
  const { data: periods = [] } = useQuery<LessonPeriod[]>({
    queryKey: ['lesson-periods', schoolId],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<LessonPeriod[]>>(
        `/lesson-periods?schoolId=${schoolId}`
      )
      return res.data.data ?? []
    },
    enabled: !!schoolId,
  })

  // Derive classes from entries
  const classMap = new Map<string, string>()
  entries.forEach(e => classMap.set(e.studentClassId, e.className))
  const classes = Array.from(classMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const currentClassId = selectedClassId || classes[0]?.id || ''

  // Sorted periods by number
  const sortedPeriods = [...periods].sort((a, b) => a.periodNumber - b.periodNumber)

  // Build grid: Map<"DAY-PERIOD", EntryDto>
  const grid = new Map<string, EntryDto>()
  entries
    .filter(e => e.studentClassId === currentClassId)
    .forEach(e => grid.set(`${e.dayOfWeek}-${e.periodNumber}`, e))

  const hasEntries = entries.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
            {timetable?.name ?? 'Dars jadvali'}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            {timetable && (
              <span className={cn(
                'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full',
                timetable.status === 'PUBLISHED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                timetable.status === 'GENERATED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              )}>
                {timetable.status === 'PUBLISHED' && <CheckCircle2 className="h-3.5 w-3.5" />}
                {timetable.status === 'GENERATED' && <Calendar className="h-3.5 w-3.5" />}
                {STATUS_LABELS[timetable.status] ?? timetable.status}
              </span>
            )}
          </div>
        </div>
      </div>

      {entriesLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : !hasEntries ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <Calendar className="h-16 w-16 mb-4 opacity-20" />
          <p className="text-xl font-medium text-gray-500">Dars kiritilmagan</p>
          <p className="text-sm mt-2">Bu jadvalda hech qanday dars mavjud emas</p>
        </div>
      ) : (
        <>
          {/* Class tabs */}
          <div className="flex flex-wrap gap-2">
            {classes.map(cls => (
              <button
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition',
                  cls.id === currentClassId
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
                )}
              >
                {cls.name}
              </button>
            ))}
          </div>

          {/* Weekly grid */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-auto">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <th className="w-28 px-3 py-3 text-left border-b border-r border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Dars / Vaqt
                  </th>
                  {DAYS.map(day => (
                    <th
                      key={day.key}
                      className="px-3 py-3 text-center border-b border-r border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 last:border-r-0"
                    >
                      {day.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedPeriods.map((period, idx) => {
                  const nextPeriod = sortedPeriods[idx + 1]
                  const breakMins = nextPeriod
                    ? breakMinutes(period.endTime, nextPeriod.startTime)
                    : null

                  return (
                    <>
                      <tr key={period.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/50">
                        {/* Period info */}
                        <td className="px-3 py-2 border-b border-r border-gray-100 dark:border-gray-700/50 align-top">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                              {period.periodNumber}-dars
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3" />
                              {formatTime(period.startTime)}–{formatTime(period.endTime)}
                            </span>
                          </div>
                        </td>

                        {/* Day cells */}
                        {DAYS.map(day => {
                          const entry = grid.get(`${day.key}-${period.periodNumber}`)
                          return (
                            <td
                              key={day.key}
                              className="px-2 py-2 border-b border-r border-gray-100 dark:border-gray-700/50 last:border-r-0 align-top min-w-[130px]"
                            >
                              {entry ? (
                                <div className={cn(
                                  'rounded-lg px-2.5 py-2 text-xs h-full',
                                  subjectColorClass(entry.subjectId)
                                )}>
                                  <p className="font-semibold leading-snug mb-1.5">
                                    {entry.subjectName}
                                  </p>
                                  <p className="flex items-center gap-1 opacity-75 leading-snug">
                                    <User className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">{entry.teacherName}</span>
                                  </p>
                                  <p className="flex items-center gap-1 opacity-60 leading-snug mt-0.5">
                                    <DoorOpen className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">{entry.classroomName}</span>
                                  </p>
                                </div>
                              ) : (
                                <div className="h-14 flex items-center justify-center">
                                  <span className="text-xs text-gray-300 dark:text-gray-600">—</span>
                                </div>
                              )}
                            </td>
                          )
                        })}
                      </tr>

                      {/* Break row */}
                      {breakMins !== null && breakMins > 0 && (
                        <tr key={`break-${period.id}`} className="bg-amber-50/60 dark:bg-amber-950/20">
                          <td
                            colSpan={6}
                            className="px-3 py-1 border-b border-gray-100 dark:border-gray-700/50"
                          >
                            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                              ☕ {breakMins} daqiqa tanaffus
                              {nextPeriod && (
                                <span className="ml-1 font-normal opacity-70">
                                  ({formatTime(period.endTime)} – {formatTime(nextPeriod.startTime)})
                                </span>
                              )}
                            </p>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 pt-1">
            {Array.from(new Set(
              entries
                .filter(e => e.studentClassId === currentClassId)
                .map(e => e.subjectId)
            )).map(subId => {
              const entry = entries.find(e => e.subjectId === subId)!
              return (
                <span
                  key={subId}
                  className={cn('text-xs px-3 py-1 rounded-full font-medium', subjectColorClass(subId))}
                >
                  {entry.subjectName}
                </span>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
