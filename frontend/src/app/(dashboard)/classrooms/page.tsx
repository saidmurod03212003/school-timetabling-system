'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DoorOpen, Plus, Pencil, Trash2, X } from 'lucide-react'
import apiClient from '@/lib/api/client'
import type { ApiResponse } from '@/types/api.types'

interface Classroom {
  id: string
  schoolId: string
  name: string
  capacity: number
  floor?: number
  building?: string
  status: string
  classroomTypeId: string
}

export default function ClassroomsPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Classroom | null>(null)
  const [form, setForm] = useState({ name: '', capacity: 30, floor: '', building: '' })

  const { data: classrooms = [], isLoading } = useQuery<Classroom[]>({
    queryKey: ['classrooms'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Classroom[]>>('/classrooms')
      return res.data.data ?? []
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const payload = {
        name: data.name,
        capacity: data.capacity,
        floor: data.floor ? Number(data.floor) : null,
        building: data.building || null,
        schoolId: editing?.schoolId ?? '00000000-0000-0000-0000-000000000000',
        classroomTypeId: editing?.classroomTypeId ?? '00000000-0000-0000-0000-000000000001',
      }
      if (editing) {
        await apiClient.put(`/classrooms/${editing.id}`, payload)
      } else {
        await apiClient.post('/classrooms', payload)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] })
      setShowModal(false)
      setEditing(null)
      setForm({ name: '', capacity: 30, floor: '', building: '' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/classrooms/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classrooms'] }),
  })

  const openEdit = (c: Classroom) => {
    setEditing(c)
    setForm({ name: c.name, capacity: c.capacity, floor: c.floor?.toString() ?? '', building: c.building ?? '' })
    setShowModal(true)
  }

  const active = classrooms.filter(c => c.status === 'ACTIVE').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Xonalar</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Jami: {classrooms.length} ta ({active} faol)</p>
        </div>
        <button
          onClick={() => { setEditing(null); setForm({ name: '', capacity: 30, floor: '', building: '' }); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="h-4 w-4" /> Xona qo'shish
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : classrooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <DoorOpen className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-lg font-medium">Xona topilmadi</p>
          <p className="text-sm mt-1">Yangi xona qo'shish uchun yuqoridagi tugmani bosing</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {classrooms.map(c => (
            <div key={c.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <DoorOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded transition">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => deleteMutation.mutate(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded transition">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{c.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{c.capacity} o'rindiq</p>
              {(c.floor || c.building) && (
                <p className="text-xs text-gray-400 mt-1">
                  {c.building}{c.floor ? `, ${c.floor}-qavat` : ''}
                </p>
              )}
              <div className="mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                  {c.status === 'ACTIVE' ? 'Faol' : 'Nofaol'}
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
                {editing ? 'Xonani tahrirlash' : 'Yangi xona'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Xona nomi *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Masalan: 101-xona"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sig'im (o'rindiq soni)</label>
                <input type="number" min={1} value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qavat</label>
                  <input type="number" value={form.floor} onChange={e => setForm(p => ({ ...p, floor: e.target.value }))}
                    placeholder="1"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bino</label>
                  <input value={form.building} onChange={e => setForm(p => ({ ...p, building: e.target.value }))}
                    placeholder="Asosiy"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium transition hover:bg-gray-50 dark:hover:bg-gray-700">
                Bekor qilish
              </button>
              <button
                onClick={() => saveMutation.mutate(form)}
                disabled={saveMutation.isPending || !form.name}
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
