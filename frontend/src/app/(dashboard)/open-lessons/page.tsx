'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  BookMarked, Plus, Search, Pencil, Trash2, X, Calendar,
  Clock, DoorOpen, Users, User, CheckCircle2, AlertCircle, Timer,
} from 'lucide-react'
import { useOpenLessonsStore, type OpenLesson } from '@/store/openLessonsStore'
import { useAuthStore } from '@/store/authStore'
import apiClient from '@/lib/api/client'
import type { ApiResponse } from '@/types/api.types'
import { cn } from '@/lib/utils'

interface Teacher { id: string; fullName: string; email?: string }
interface Subject { id: string; name: string; code: string }
interface SchoolClass { id: string; name: string }
interface Classroom { id: string; name: string; capacity?: number }

interface FormState {
  title: string
  subjectName: string
  teacherId: string
  teacherName: string
  date: string
  startTime: string
  endTime: string
  classroom: string
  className: string
  description: string
  status: OpenLesson['status']
}

const DEFAULT_FORM: FormState = {
  title: '',
  subjectName: '',
  teacherId: '',
  teacherName: '',
  date: '',
  startTime: '',
  endTime: '',
  classroom: '',
  className: '',
  description: '',
  status: 'UPCOMING',
}

const STATUS_CONFIG = {
  UPCOMING: { label: "Kelayotgan",  icon: Timer,         bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  ONGOING:  { label: "Davom etayapti", icon: AlertCircle, bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  COMPLETED:{ label: "Yakunlangan", icon: CheckCircle2,  bg: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
}

export default function OpenLessonsPage() {
  const { user } = useAuthStore()
  const schoolId = user?.schoolId ?? ''
  const isTeacher = user?.roles?.includes('TEACHER')
  const isAdmin = user?.roles?.some(r => ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACADEMIC_MANAGER'].includes(r))

  const { lessons, addLesson, updateLesson, deleteLesson } = useOpenLessonsStore()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OpenLesson['status'] | 'ALL'>('ALL')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<OpenLesson | null>(null)
  const [form, setForm] = useState<FormState>(DEFAULT_FORM)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const { data: teachers = [] } = useQuery<Teacher[]>({
    queryKey: ['teachers', schoolId],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Teacher[]>>(
        schoolId ? `/teachers?schoolId=${schoolId}` : '/teachers'
      )
      return res.data.data ?? []
    },
    enabled: !!schoolId,
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

  const { data: classes = [] } = useQuery<SchoolClass[]>({
    queryKey: ['classes', schoolId],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<SchoolClass[]>>(
        `/classes?schoolId=${schoolId}`
      )
      return res.data.data ?? []
    },
    enabled: !!schoolId,
  })

  const { data: classrooms = [] } = useQuery<Classroom[]>({
    queryKey: ['classrooms', schoolId],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Classroom[]>>(
        `/classrooms?schoolId=${schoolId}`
      )
      return res.data.data ?? []
    },
    enabled: !!schoolId,
  })

  const visibleLessons = lessons.filter(l => {
    if (isTeacher && !isAdmin) {
      const teacherMatch = teachers.find(t => t.email === user?.email || t.id === user?.id)
      if (teacherMatch && l.teacherId !== teacherMatch.id) return false
    }
    const matchSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.teacherName.toLowerCase().includes(search.toLowerCase()) ||
      l.subjectName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || l.status === statusFilter
    return matchSearch && matchStatus
  })

  const openAdd = () => {
    setEditing(null)
    setForm(DEFAULT_FORM)
    setShowModal(true)
  }

  const openEdit = (lesson: OpenLesson) => {
    setEditing(lesson)
    setForm({
      title: lesson.title,
      subjectName: lesson.subjectName,
      teacherId: lesson.teacherId,
      teacherName: lesson.teacherName,
      date: lesson.date,
      startTime: lesson.startTime,
      endTime: lesson.endTime,
      classroom: lesson.classroom,
      className: lesson.className,
      description: lesson.description ?? '',
      status: lesson.status,
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditing(null)
    setForm(DEFAULT_FORM)
  }

  const handleTeacherChange = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId)
    setForm(prev => ({
      ...prev,
      teacherId,
      teacherName: teacher?.fullName ?? '',
    }))
  }

  const handleSubmit = () => {
    if (!form.title || !form.teacherId || !form.date || !form.startTime || !form.endTime) return
    if (editing) {
      updateLesson(editing.id, form)
    } else {
      addLesson({ ...form, createdBy: user?.id ?? 'admin' })
    }
    closeModal()
  }

  const handleDelete = (id: string) => {
    deleteLesson(id)
    setConfirmDeleteId(null)
  }

  const upcoming = lessons.filter(l => l.status === 'UPCOMING').length
  const ongoing  = lessons.filter(l => l.status === 'ONGOING').length
  const completed= lessons.filter(l => l.status === 'COMPLETED').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ochiq darslar</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Jami: {lessons.length} ta ochiq dars
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Ochiq dars qo'shish
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Kelayotgan',       value: upcoming,  color: 'blue' },
          { label: 'Davom etayapti',   value: ongoing,   color: 'amber' },
          { label: 'Yakunlangan',      value: completed, color: 'green' },
        ].map(s => (
          <div
            key={s.label}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center"
          >
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Qidirish: mavzu, o'qituvchi, fan..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition',
                statusFilter === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              )}
            >
              {s === 'ALL' ? 'Hammasi' : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Lessons list */}
      {visibleLessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <BookMarked className="h-14 w-14 mb-3 opacity-20" />
          <p className="text-lg font-medium">Ochiq dars topilmadi</p>
          {isAdmin && (
            <p className="text-sm mt-1">Yangi ochiq dars qo'shish uchun yuqoridagi tugmani bosing</p>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {visibleLessons.map(lesson => {
            const cfg = STATUS_CONFIG[lesson.status]
            const StatusIcon = cfg.icon
            return (
              <div
                key={lesson.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Left: icon */}
                  <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                    <BookMarked className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>

                  {/* Middle: details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-base truncate">
                        {lesson.title}
                      </h3>
                      <span className={cn('inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium', cfg.bg)}>
                        <StatusIcon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{lesson.teacherName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookMarked className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{lesson.subjectName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{lesson.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{lesson.startTime} – {lesson.endTime}</span>
                      </div>
                      {lesson.classroom && (
                        <div className="flex items-center gap-2">
                          <DoorOpen className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{lesson.classroom}</span>
                        </div>
                      )}
                      {lesson.className && (
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{lesson.className}</span>
                        </div>
                      )}
                    </div>

                    {lesson.description && (
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic line-clamp-2">
                        {lesson.description}
                      </p>
                    )}
                  </div>

                  {/* Right: actions (admin only) */}
                  {isAdmin && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => openEdit(lesson)}
                        className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
                        title="Tahrirlash"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(lesson.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                        title="O'chirish"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[92vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                  <BookMarked className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editing ? "Ochiq darsni tahrirlash" : "Yangi ochiq dars"}
                </h2>
              </div>
              <button onClick={closeModal} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Mavzu (nomi) *
                </label>
                <input
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Masalan: Algebraik ifodalar"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Teacher */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  O'qituvchi *
                </label>
                {teachers.length > 0 ? (
                  <select
                    value={form.teacherId}
                    onChange={e => handleTeacherChange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">O'qituvchini tanlang...</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.fullName}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={form.teacherName}
                    onChange={e => setForm(p => ({ ...p, teacherName: e.target.value, teacherId: `manual-${Date.now()}` }))}
                    placeholder="O'qituvchi ismi"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fan</label>
                {subjects.length > 0 ? (
                  <select
                    value={form.subjectName}
                    onChange={e => setForm(p => ({ ...p, subjectName: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Fanni tanlang...</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={form.subjectName}
                    onChange={e => setForm(p => ({ ...p, subjectName: e.target.value }))}
                    placeholder="Fan nomi"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              </div>

              {/* Date + Time row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Sana *
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Boshlanish *
                  </label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Tugash *
                  </label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Classroom + Class row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Xona</label>
                  {classrooms.length > 0 ? (
                    <select
                      value={form.classroom}
                      onChange={e => setForm(p => ({ ...p, classroom: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Xonani tanlang...</option>
                      {classrooms.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={form.classroom}
                      onChange={e => setForm(p => ({ ...p, classroom: e.target.value }))}
                      placeholder="Masalan: 205-xona"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Sinf</label>
                  {classes.length > 0 ? (
                    <select
                      value={form.className}
                      onChange={e => setForm(p => ({ ...p, className: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Sinfni tanlang...</option>
                      {classes.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={form.className}
                      onChange={e => setForm(p => ({ ...p, className: e.target.value }))}
                      placeholder="Masalan: 9-A"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Holat</label>
                <div className="flex gap-3">
                  {(['UPCOMING', 'ONGOING', 'COMPLETED'] as const).map(s => {
                    const cfg = STATUS_CONFIG[s]
                    const Icon = cfg.icon
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, status: s }))}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm font-medium transition',
                          form.status === s
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                            : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Izoh / Tavsif
                </label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  placeholder="Qo'shimcha ma'lumot (ixtiyoriy)..."
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 shrink-0">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.title || !form.teacherId || !form.date || !form.startTime || !form.endTime}
                className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
              >
                {editing ? 'Saqlash' : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">O'chirishni tasdiqlang</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Bu amalni bekor qilib bo'lmaydi</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 font-medium transition"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
