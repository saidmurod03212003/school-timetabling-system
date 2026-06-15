'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BookOpen, Plus, Pencil, Trash2, X } from 'lucide-react'
import apiClient from '@/lib/api/client'
import type { ApiResponse } from '@/types/api.types'

interface Subject {
  id: string
  schoolId: string
  name: string
  code: string
  color: string
  isCore: boolean
}

const COLORS = ['#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6']

export default function SubjectsPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Subject | null>(null)
  const [form, setForm] = useState({ name: '', code: '', color: '#6366f1', isCore: true })

  const { data: subjects = [], isLoading } = useQuery<Subject[]>({
    queryKey: ['subjects'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Subject[]>>('/subjects')
      return res.data.data ?? []
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const payload = { ...data, schoolId: editing?.schoolId ?? '00000000-0000-0000-0000-000000000000' }
      if (editing) {
        await apiClient.put(`/subjects/${editing.id}`, payload)
      } else {
        await apiClient.post('/subjects', payload)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      setShowModal(false)
      setEditing(null)
      setForm({ name: '', code: '', color: '#6366f1', isCore: true })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/subjects/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subjects'] }),
  })

  const openEdit = (s: Subject) => {
    setEditing(s)
    setForm({ name: s.name, code: s.code, color: s.color, isCore: s.isCore })
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fanlar</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Jami: {subjects.length} ta fan</p>
        </div>
        <button
          onClick={() => { setEditing(null); setForm({ name: '', code: '', color: '#6366f1', isCore: true }); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="h-4 w-4" /> Fan qo'shish
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <BookOpen className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-lg font-medium">Fan topilmadi</p>
          <p className="text-sm mt-1">Yangi fan qo'shish uchun yuqoridagi tugmani bosing</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {subjects.map(subject => (
            <div key={subject.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: subject.color + '22' }}>
                  <BookOpen className="h-5 w-5" style={{ color: subject.color }} />
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(subject)} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded transition">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => deleteMutation.mutate(subject.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded transition">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{subject.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{subject.code}</p>
              <div className="mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${subject.isCore ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                  {subject.isCore ? 'Asosiy fan' : 'Qo\'shimcha fan'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editing ? 'Fanni tahrirlash' : 'Yangi fan'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fan nomi *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Masalan: Matematika"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kod *</label>
                <input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  placeholder="Masalan: MATH"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rang</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setForm(p => ({ ...p, color: c }))}
                      className={`h-8 w-8 rounded-full transition ring-offset-2 ${form.color === c ? 'ring-2 ring-gray-800 dark:ring-white' : ''}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, isCore: !p.isCore }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${form.isCore ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${form.isCore ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300">Asosiy fan</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium transition hover:bg-gray-50 dark:hover:bg-gray-700">
                Bekor qilish
              </button>
              <button
                onClick={() => saveMutation.mutate(form)}
                disabled={saveMutation.isPending || !form.name || !form.code}
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
