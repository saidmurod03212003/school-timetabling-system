'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GraduationCap, Plus, Search, Pencil, Trash2, X, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import apiClient from '@/lib/api/client'
import { useAuthStore } from '@/store/authStore'
import type { ApiResponse } from '@/types/api.types'

interface Teacher {
  id: string
  schoolId: string
  fullName: string
  shortName?: string
  phone?: string
  email?: string
  employmentType: string
  minWeeklyLoad: number
  maxWeeklyLoad: number
  isActive: boolean
}

interface Subject {
  id: string
  name: string
  code: string
  color?: string
}

interface TeacherSubject {
  id: string
  subjectId: string
  isPrimary: boolean
}

interface FormState {
  fullName: string
  shortName: string
  phone: string
  email: string
  employmentType: string
  maxWeeklyLoad: number
  subjectSelections: Record<string, boolean> // subjectId → isPrimary (true) | selected (false)
}

const DEFAULT_FORM: FormState = {
  fullName: '',
  shortName: '',
  phone: '',
  email: '',
  employmentType: 'FULL_TIME',
  maxWeeklyLoad: 24,
  subjectSelections: {},
}

export default function TeachersPage() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const schoolId = user?.schoolId ?? ''

  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Teacher | null>(null)
  const [form, setForm] = useState<FormState>(DEFAULT_FORM)
  const [showSubjects, setShowSubjects] = useState(false)

  const { data: teachers = [], isLoading } = useQuery<Teacher[]>({
    queryKey: ['teachers', schoolId],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Teacher[]>>(
        schoolId ? `/teachers?schoolId=${schoolId}` : '/teachers'
      )
      return res.data.data ?? []
    },
  })

  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ['subjects', schoolId],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Subject[]>>(
        `/subjects?schoolId=${schoolId}`
      )
      return res.data.data ?? []
    },
    enabled: !!schoolId,
  })

  const saveMutation = useMutation({
    mutationFn: async (data: FormState) => {
      let teacherId = editing?.id ?? null
      const payload = {
        schoolId,
        fullName: data.fullName,
        shortName: data.shortName || undefined,
        phone: data.phone || undefined,
        email: data.email || undefined,
        employmentType: data.employmentType,
        maxWeeklyLoad: data.maxWeeklyLoad,
      }
      if (editing) {
        await apiClient.put(`/teachers/${editing.id}`, payload)
      } else {
        const res = await apiClient.post<ApiResponse<Teacher>>('/teachers', payload)
        teacherId = res.data.data?.id ?? null
      }
      if (teacherId) {
        const subjectItems = Object.entries(data.subjectSelections)
          .filter(([, selected]) => selected !== undefined)
          .map(([subjectId, isPrimary]) => ({ subjectId, isPrimary: isPrimary === true }))
        await apiClient.put(`/teachers/${teacherId}/subjects`, subjectItems)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers', schoolId] })
      closeModal()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/teachers/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teachers', schoolId] }),
  })

  const openAdd = () => {
    setEditing(null)
    setForm(DEFAULT_FORM)
    setShowSubjects(false)
    setShowModal(true)
  }

  const openEdit = async (t: Teacher) => {
    setEditing(t)
    setShowSubjects(false)
    const res = await apiClient.get<ApiResponse<TeacherSubject[]>>(`/teachers/${t.id}/subjects`)
    const existing = res.data.data ?? []
    const selections: Record<string, boolean> = {}
    existing.forEach(ts => { selections[ts.subjectId] = ts.isPrimary })
    setForm({
      fullName: t.fullName,
      shortName: t.shortName ?? '',
      phone: t.phone ?? '',
      email: t.email ?? '',
      employmentType: t.employmentType,
      maxWeeklyLoad: t.maxWeeklyLoad,
      subjectSelections: selections,
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditing(null)
    setForm(DEFAULT_FORM)
    setShowSubjects(false)
  }

  const toggleSubject = (subjectId: string) => {
    setForm(prev => {
      const next = { ...prev.subjectSelections }
      if (subjectId in next) {
        delete next[subjectId]
      } else {
        next[subjectId] = false // selected but not primary
      }
      return { ...prev, subjectSelections: next }
    })
  }

  const togglePrimary = (subjectId: string) => {
    setForm(prev => ({
      ...prev,
      subjectSelections: {
        ...prev.subjectSelections,
        [subjectId]: !prev.subjectSelections[subjectId],
      },
    }))
  }

  const selectedSubjectCount = Object.keys(form.subjectSelections).length

  const filtered = teachers.filter(t =>
    t.fullName.toLowerCase().includes(search.toLowerCase()) ||
    (t.email ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">O'qituvchilar</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Jami: {teachers.length} ta o'qituvchi</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="h-4 w-4" /> O'qituvchi qo'shish
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Ism yoki email bo'yicha qidirish..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <GraduationCap className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-lg font-medium">O'qituvchi topilmadi</p>
          <p className="text-sm mt-1">Yangi o'qituvchi qo'shish uchun yuqoridagi tugmani bosing</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Ism</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Telefon</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Ish turi</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Soat/hafta</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map(teacher => (
                <tr key={teacher.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                        {teacher.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{teacher.fullName}</p>
                        {teacher.shortName && <p className="text-xs text-gray-500">{teacher.shortName}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{teacher.email ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{teacher.phone ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${teacher.employmentType === 'FULL_TIME' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                      {teacher.employmentType === 'FULL_TIME' ? 'Asosiy' : 'Yarim stavka'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{teacher.maxWeeklyLoad}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(teacher)} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded transition">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteMutation.mutate(teacher.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded transition">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editing ? "O'qituvchini tahrirlash" : "Yangi o'qituvchi"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              {[
                { key: 'fullName',  label: "To'liq ism *",    placeholder: 'Masalan: Abdullayev Jasur' },
                { key: 'shortName', label: 'Qisqa ism',       placeholder: 'Masalan: A. Jasur' },
                { key: 'email',     label: 'Email',            placeholder: 'email@maktab.uz' },
                { key: 'phone',     label: 'Telefon',          placeholder: '+998 90 123 45 67' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{f.label}</label>
                  <input
                    value={(form as Record<string, string | number | Record<string, boolean>>)[f.key] as string}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ish turi</label>
                <select
                  value={form.employmentType}
                  onChange={e => setForm(prev => ({ ...prev, employmentType: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="FULL_TIME">Asosiy (to'liq stavka)</option>
                  <option value="PART_TIME">Yarim stavka</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Haftalik max soat</label>
                <input
                  type="number" min={1} max={40}
                  value={form.maxWeeklyLoad}
                  onChange={e => setForm(prev => ({ ...prev, maxWeeklyLoad: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Subject selection */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowSubjects(v => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-indigo-500" />
                    Dars bera oladigan fanlar
                    {selectedSubjectCount > 0 && (
                      <span className="ml-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                        {selectedSubjectCount} ta
                      </span>
                    )}
                  </span>
                  {showSubjects ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {showSubjects && (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-56 overflow-y-auto">
                    {subjects.map(sub => {
                      const selected = sub.id in form.subjectSelections
                      const isPrimary = form.subjectSelections[sub.id] === true
                      return (
                        <div
                          key={sub.id}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-750 transition"
                        >
                          <input
                            type="checkbox"
                            id={`ts-${sub.id}`}
                            checked={selected}
                            onChange={() => toggleSubject(sub.id)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`ts-${sub.id}`}
                            className="flex-1 text-sm text-gray-800 dark:text-gray-200 cursor-pointer select-none"
                          >
                            {sub.name}
                            <span className="ml-1.5 text-xs text-gray-400">{sub.code}</span>
                          </label>
                          {selected && (
                            <button
                              type="button"
                              onClick={() => togglePrimary(sub.id)}
                              className={`text-xs px-2 py-0.5 rounded-full font-medium transition ${isPrimary ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-indigo-50 hover:text-indigo-600'}`}
                            >
                              {isPrimary ? 'Asosiy' : 'Qo\'shimcha'}
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 shrink-0">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => saveMutation.mutate(form)}
                disabled={saveMutation.isPending || !form.fullName}
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
