'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Clock, Plus, Pencil, Trash2, X } from 'lucide-react'
import apiClient from '@/lib/api/client'
import { useAuthStore } from '@/store/authStore'
import type { ApiResponse } from '@/types/api.types'

interface LessonPeriod {
  id: string
  schoolId: string
  periodNumber: number
  startTime: string
  endTime: string
  shift: string
  isActive: boolean
}

interface FormState {
  periodNumber: string
  startTime: string
  endTime: string
  shift: string
}

const DEFAULT_FORM: FormState = {
  periodNumber: '',
  startTime: '08:00',
  endTime: '08:45',
  shift: 'FIRST',
}

function fmt(t: string) {
  return t?.substring(0, 5) ?? ''
}

function breakMins(end: string, nextStart: string): number {
  const [eh, em] = end.split(':').map(Number)
  const [sh, sm] = nextStart.split(':').map(Number)
  return (sh * 60 + sm) - (eh * 60 + em)
}

export default function LessonPeriodsPage() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const schoolId = user?.schoolId ?? ''

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(DEFAULT_FORM)

  const { data: periods = [], isLoading } = useQuery<LessonPeriod[]>({
    queryKey: ['lesson-periods', schoolId],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<LessonPeriod[]>>(
        `/lesson-periods?schoolId=${schoolId}`
      )
      return res.data.data ?? []
    },
    enabled: !!schoolId,
  })

  const sorted = [...periods].sort((a, b) => a.periodNumber - b.periodNumber)

  const saveMutation = useMutation({
    mutationFn: async (data: FormState) => {
      const payload = {
        schoolId,
        periodNumber: Number(data.periodNumber),
        startTime: data.startTime,
        endTime: data.endTime,
        shift: data.shift,
      }
      if (editingId) {
        await apiClient.put(`/lesson-periods/${editingId}`, payload)
      } else {
        await apiClient.post('/lesson-periods', payload)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-periods', schoolId] })
      closeModal()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/lesson-periods/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lesson-periods', schoolId] }),
  })

  const openAdd = () => {
    setEditingId(null)
    const nextNum = sorted.length > 0 ? sorted[sorted.length - 1].periodNumber + 1 : 1
    setForm({ ...DEFAULT_FORM, periodNumber: String(nextNum) })
    setShowModal(true)
  }

  const openEdit = (p: LessonPeriod) => {
    setEditingId(p.id)
    setForm({
      periodNumber: String(p.periodNumber),
      startTime: fmt(p.startTime),
      endTime: fmt(p.endTime),
      shift: p.shift ?? 'FIRST',
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setForm(DEFAULT_FORM)
  }

  const set = (key: keyof FormState, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dars vaqtlari</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {sorted.length} ta dars soati belgilangan
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="h-4 w-4" /> Qo'shish
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Clock className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-lg font-medium">Dars vaqti topilmadi</p>
        </div>
      ) : (
        <div className="max-w-xl space-y-2">
          {sorted.map((period, idx) => {
            const next = sorted[idx + 1]
            const mins = next ? breakMins(period.endTime, next.startTime) : null
            return (
              <div key={period.id}>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-4 flex items-center gap-4 group hover:shadow-sm transition">
                  {/* Period badge */}
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                      {period.periodNumber}
                    </span>
                  </div>

                  {/* Time info */}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {period.periodNumber}-dars
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3.5 w-3.5" />
                      {fmt(period.startTime)} – {fmt(period.endTime)}
                      <span className="ml-2 text-xs text-gray-400">
                        ({(() => {
                          const [sh, sm] = period.startTime.split(':').map(Number)
                          const [eh, em] = period.endTime.split(':').map(Number)
                          return (eh * 60 + em) - (sh * 60 + sm)
                        })()} daqiqa)
                      </span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => openEdit(period)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(period.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Break indicator */}
                {mins !== null && mins > 0 && (
                  <div className="flex items-center gap-3 px-5 py-1.5">
                    <div className="w-px h-4 bg-amber-300 dark:bg-amber-600 ml-[18px]" />
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      {mins} daqiqa tanaffus
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingId ? 'Vaqtni tahrirlash' : "Yangi dars vaqti"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dars raqami *
                </label>
                <input
                  type="number" min={1} max={12}
                  value={form.periodNumber}
                  onChange={e => set('periodNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Boshlanish *
                  </label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={e => set('startTime', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tugash *
                  </label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={e => set('endTime', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Smena
                </label>
                <select
                  value={form.shift}
                  onChange={e => set('shift', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="FIRST">1-smena</option>
                  <option value="SECOND">2-smena</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition"
              >
                Bekor
              </button>
              <button
                onClick={() => saveMutation.mutate(form)}
                disabled={saveMutation.isPending || !form.periodNumber || !form.startTime || !form.endTime}
                className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition"
              >
                {saveMutation.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
