'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, Plus, Trash2, BookOpen, X, ChevronDown, ChevronUp } from 'lucide-react'
import apiClient from '@/lib/api/client'
import { useAuthStore } from '@/store/authStore'
import type { ApiResponse } from '@/types/api.types'

interface StudentClass {
  id: string
  schoolId: string
  academicYearId: string
  name: string
  gradeLevel: number
  section: string
  studentCount: number
  shift: string
  isActive: boolean
}

interface Subject {
  id: string
  name: string
  code: string
  color?: string
}

interface ClassSubject {
  id: string
  classId: string
  subjectId: string
  weeklyHours: number
}

interface FormState {
  name: string
  gradeLevel: string
  section: string
  studentCount: string
  shift: string
  subjectSelections: Record<string, number> // subjectId → weeklyHours (0 = not selected)
}

const SHIFTS = [
  { value: 'FIRST',  label: '1-smena (ertalab)' },
  { value: 'SECOND', label: '2-smena (tushdan keyin)' },
]

const DEFAULT_FORM: FormState = {
  name: '',
  gradeLevel: '5',
  section: 'A',
  studentCount: '30',
  shift: 'FIRST',
  subjectSelections: {},
}

export default function ClassesPage() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const schoolId = user?.schoolId ?? ''

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(DEFAULT_FORM)
  const [showSubjects, setShowSubjects] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Fetch academic year
  const { data: academicYears = [] } = useQuery<{ id: string; name: string }[]>({
    queryKey: ['academic-years', schoolId],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<{ id: string; name: string }[]>>(
        `/academic-years?schoolId=${schoolId}`
      )
      return res.data.data ?? []
    },
    enabled: !!schoolId,
  })
  const academicYearId = academicYears[0]?.id ?? ''

  // Fetch classes
  const { data: classes = [], isLoading } = useQuery<StudentClass[]>({
    queryKey: ['classes', schoolId],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<StudentClass[]>>(
        `/classes?schoolId=${schoolId}`
      )
      return res.data.data ?? []
    },
    enabled: !!schoolId,
  })

  // Fetch subjects
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

  // Save class + subjects
  const saveMutation = useMutation({
    mutationFn: async (data: FormState) => {
      let classId = editingId
      const payload = {
        schoolId,
        academicYearId,
        name: data.name,
        gradeLevel: Number(data.gradeLevel),
        section: data.section,
        studentCount: Number(data.studentCount),
        shift: data.shift,
      }
      if (editingId) {
        await apiClient.put(`/classes/${editingId}`, payload)
      } else {
        const res = await apiClient.post<ApiResponse<StudentClass>>('/classes', payload)
        classId = res.data.data?.id ?? null
      }
      if (classId) {
        const subjectItems = Object.entries(data.subjectSelections)
          .filter(([, h]) => h > 0)
          .map(([subjectId, weeklyHours]) => ({ subjectId, weeklyHours }))
        await apiClient.put(`/classes/${classId}/subjects`, subjectItems)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes', schoolId] })
      closeModal()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/classes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes', schoolId] })
      setDeleteConfirm(null)
    },
  })

  const openAdd = () => {
    setEditingId(null)
    setForm(DEFAULT_FORM)
    setShowSubjects(false)
    setShowModal(true)
  }

  const openEdit = async (cls: StudentClass) => {
    setEditingId(cls.id)
    setShowSubjects(false)
    // Load existing class subjects
    const res = await apiClient.get<ApiResponse<ClassSubject[]>>(`/classes/${cls.id}/subjects`)
    const existingSubjects = res.data.data ?? []
    const selections: Record<string, number> = {}
    existingSubjects.forEach(s => { selections[s.subjectId] = s.weeklyHours })
    setForm({
      name: cls.name,
      gradeLevel: String(cls.gradeLevel),
      section: cls.section,
      studentCount: String(cls.studentCount),
      shift: cls.shift ?? 'FIRST',
      subjectSelections: selections,
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setForm(DEFAULT_FORM)
    setShowSubjects(false)
  }

  const toggleSubject = (subjectId: string) => {
    setForm(prev => {
      const current = prev.subjectSelections[subjectId]
      const next = { ...prev.subjectSelections }
      if (current) {
        delete next[subjectId]
      } else {
        next[subjectId] = 1
      }
      return { ...prev, subjectSelections: next }
    })
  }

  const setWeeklyHours = (subjectId: string, hours: number) => {
    setForm(prev => ({
      ...prev,
      subjectSelections: { ...prev.subjectSelections, [subjectId]: hours },
    }))
  }

  const selectedSubjectCount = Object.values(form.subjectSelections).filter(h => h > 0).length

  if (!schoolId) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <p>Maktab aniqlanmadi. Tizimga qayta kiring.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sinflar</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Jami: {classes.length} ta sinf</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="h-4 w-4" /> Sinf qo'shish
        </button>
      </div>

      {/* Classes grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : classes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Users className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-lg font-medium">Sinf topilmadi</p>
          <p className="text-sm mt-1">Yangi sinf qo'shish uchun yuqoridagi tugmani bosing</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {classes.map(cls => (
            <div
              key={cls.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
                  <span className="text-indigo-700 dark:text-indigo-300 font-bold text-lg">{cls.name}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => openEdit(cls)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
                  >
                    <BookOpen className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(cls.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{cls.name} sinfi</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                <p>{cls.studentCount} ta o'quvchi</p>
                <p>{cls.shift === 'SECOND' ? '2-smena' : '1-smena'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-80">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sinfni o'chirish</h3>
            <p className="text-sm text-gray-500 mb-4">
              Bu sinfni o'chirishni tasdiqlaysizmi? Bu amal qaytarib bo'lmaydi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Bekor
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirm)}
                disabled={deleteMutation.isPending}
                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingId ? 'Sinfni tahrirlash' : "Yangi sinf qo'shish"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              {/* Class basic fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sinf nomi *
                  </label>
                  <input
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Masalan: 5A"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sinf darajasi *
                  </label>
                  <input
                    type="number" min={1} max={12}
                    value={form.gradeLevel}
                    onChange={e => setForm(p => ({ ...p, gradeLevel: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bo'lim (A, B, ...)
                  </label>
                  <input
                    value={form.section}
                    onChange={e => setForm(p => ({ ...p, section: e.target.value }))}
                    placeholder="A"
                    maxLength={5}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    O'quvchilar soni
                  </label>
                  <input
                    type="number" min={1} max={50}
                    value={form.studentCount}
                    onChange={e => setForm(p => ({ ...p, studentCount: e.target.value }))}
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
                  onChange={e => setForm(p => ({ ...p, shift: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {SHIFTS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
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
                    Fanlar tanlash
                    {selectedSubjectCount > 0 && (
                      <span className="ml-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                        {selectedSubjectCount} ta
                      </span>
                    )}
                  </span>
                  {showSubjects ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {showSubjects && (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-64 overflow-y-auto">
                    {subjects.map(sub => {
                      const hours = form.subjectSelections[sub.id]
                      const selected = !!hours && hours > 0
                      return (
                        <div
                          key={sub.id}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-750 transition"
                        >
                          <input
                            type="checkbox"
                            id={`sub-${sub.id}`}
                            checked={selected}
                            onChange={() => toggleSubject(sub.id)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`sub-${sub.id}`}
                            className="flex-1 text-sm text-gray-800 dark:text-gray-200 cursor-pointer select-none"
                          >
                            {sub.name}
                            <span className="ml-1.5 text-xs text-gray-400">{sub.code}</span>
                          </label>
                          {selected && (
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-xs text-gray-400">soat/hafta:</span>
                              <input
                                type="number" min={1} max={10}
                                value={hours}
                                onChange={e => setWeeklyHours(sub.id, Number(e.target.value))}
                                onClick={e => e.stopPropagation()}
                                className="w-14 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
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
                disabled={saveMutation.isPending || !form.name || !academicYearId}
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
