'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Play, Zap, Clock, Target, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { timetableApi } from '@/lib/api/timetable'
import { useAuthStore } from '@/store/authStore'
import apiClient from '@/lib/api/client'
import type { TimetableGenerationStatus } from '@/types/timetable.types'
import type { ApiResponse } from '@/types/api.types'

interface Semester {
  id: string
  name: string
  semesterNumber: number
  startDate: string
  endDate: string
  current: boolean
}

const generateSchema = z.object({
  semesterId: z.string().min(1, 'Semesterni tanlang'),
  name: z.string().min(3, "Jadval nomi kamida 3 ta belgidan iborat bo'lishi kerak"),
  solverDurationSeconds: z.number().min(30).max(1800),
  optimizationLevel: z.enum(['FAST', 'BALANCED', 'THOROUGH']),
})

type GenerateForm = z.infer<typeof generateSchema>

const OPTIMIZATION_LEVELS = [
  { value: 'FAST' as const,     label: 'Tez',         description: '1 daqiqa — tezkor natija',    icon: Zap,    color: 'border-amber-300 bg-amber-50 dark:bg-amber-900/20',   selectedColor: 'border-amber-500 bg-amber-100 dark:bg-amber-900/40' },
  { value: 'BALANCED' as const, label: 'Muvozanatli', description: '5 daqiqa — yaxshi sifat',     icon: Target, color: 'border-blue-300 bg-blue-50 dark:bg-blue-900/20',     selectedColor: 'border-blue-500 bg-blue-100 dark:bg-blue-900/40' },
  { value: 'THOROUGH' as const, label: 'Chuqur',      description: '30 daqiqa — eng yaxshi natija',icon: Clock,  color: 'border-green-300 bg-green-50 dark:bg-green-900/20',   selectedColor: 'border-green-500 bg-green-100 dark:bg-green-900/40' },
]

export default function GenerateTimetablePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const schoolId = user?.schoolId || ''

  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [pollingEnabled, setPollingEnabled] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<GenerateForm>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      optimizationLevel: 'BALANCED',
      solverDurationSeconds: 300,
      name: '',
      semesterId: '',
    },
  })

  const selectedLevel = watch('optimizationLevel')

  // Real semesterlarni yuklash
  const { data: semesters = [], isLoading: semestersLoading } = useQuery<Semester[]>({
    queryKey: ['semesters', schoolId],
    queryFn: async () => {
      const params = schoolId ? `?schoolId=${schoolId}` : ''
      const res = await apiClient.get<ApiResponse<Semester[]>>(`/semesters${params}`)
      return res.data.data ?? []
    },
  })

  // Joriy semesterni avtomatik tanlash
  useEffect(() => {
    const current = semesters.find(s => s.current)
    if (current) setValue('semesterId', current.id)
    else if (semesters.length > 0) setValue('semesterId', semesters[0].id)
  }, [semesters, setValue])

  const { data: status } = useQuery({
    queryKey: ['timetable-status', generatingId],
    queryFn: () => timetableApi.getStatus(schoolId, generatingId!),
    enabled: !!generatingId && !!schoolId && pollingEnabled,
    refetchInterval: 3000,
  })

  useEffect(() => {
    if (status?.status === 'GENERATED' || status?.status === 'FAILED') {
      setPollingEnabled(false)
      if (status.status === 'GENERATED') {
        queryClient.invalidateQueries({ queryKey: ['timetables', schoolId] })
        setTimeout(() => router.push('/timetable'), 2000)
      }
    }
  }, [status, generatingId, router, schoolId, queryClient])

  const generateMutation = useMutation({
    mutationFn: (data: GenerateForm) =>
      timetableApi.generate(schoolId, { ...data, includedClassIds: [] }),
    onSuccess: (result) => {
      setGeneratingId(result.timetableId)
      setPollingEnabled(true)
    },
  })

  const isGenerating = status?.status === 'GENERATING'

  if (!schoolId) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800 dark:text-amber-300">Maktab tanlanmagan</p>
            <p className="text-sm text-amber-600 dark:text-amber-500 mt-1">
              Jadval yaratish uchun hisobingiz maktabga biriktirilgan bo'lishi kerak. Qayta kiring.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Yangi dars jadvali yaratish</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Tizim barcha cheklovlarni hisobga olgan holda optimal jadval yaratadi
        </p>
      </div>

      {/* Generation progress */}
      {generatingId && status && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            {isGenerating ? (
              <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
            ) : status.status === 'GENERATED' ? (
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            ) : (
              <AlertCircle className="h-6 w-6 text-red-600" />
            )}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {isGenerating ? 'Jadval yaratilmoqda...'
                  : status.status === 'GENERATED' ? "Jadval muvaffaqiyatli yaratildi!"
                  : "Jadval yaratishda xato yuz berdi"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isGenerating
                  ? `${Math.floor(status.elapsedSeconds / 60)}:${String(status.elapsedSeconds % 60).padStart(2, '0')} o'tdi`
                  : status.status === 'GENERATED' ? "Jadvallar ro'yxatiga o'tilmoqda..."
                  : "Qaytadan urinib ko'ring"}
              </p>
            </div>
          </div>
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Jarayon</span>
                <span>{status.progressPercent || 0}%</span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${status.progressPercent || 0}%` }} />
              </div>
            </div>
          )}
        </div>
      )}

      {!generatingId && (
        <form onSubmit={handleSubmit(d => generateMutation.mutate(d))} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Asosiy ma'lumotlar</h2>

            {/* Jadval nomi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Jadval nomi
              </label>
              <input
                {...register('name')}
                placeholder="Masalan: 2024-2025 o'quv yili 1-semestr jadvali"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            {/* Semestr */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Semestr
              </label>
              {semestersLoading ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-400">Semesterlar yuklanmoqda...</span>
                </div>
              ) : semesters.length === 0 ? (
                <div className="px-4 py-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-900/20 text-sm text-amber-700 dark:text-amber-400">
                  Semestr topilmadi. Avval maktab va o'quv yili ma'lumotlarini kiriting.
                </div>
              ) : (
                <select
                  {...register('semesterId')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Semesterni tanlang</option>
                  {semesters.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.current ? '(joriy)' : ''}
                    </option>
                  ))}
                </select>
              )}
              {errors.semesterId && <p className="mt-1 text-sm text-red-600">{errors.semesterId.message}</p>}
            </div>
          </div>

          {/* Optimallashtirish darajasi */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Optimallashtirish darajasi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {OPTIMIZATION_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => {
                    setValue('optimizationLevel', level.value)
                    setValue('solverDurationSeconds', { FAST: 60, BALANCED: 300, THOROUGH: 1800 }[level.value])
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition ${selectedLevel === level.value ? level.selectedColor : level.color}`}
                >
                  <level.icon className="h-6 w-6 mb-2 text-gray-700 dark:text-gray-300" />
                  <p className="font-semibold text-gray-900 dark:text-white">{level.label}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{level.description}</p>
                </button>
              ))}
            </div>
          </div>

          {generateMutation.isError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">
                Jadval yaratishda xato yuz berdi. Qaytadan urinib ko'ring.
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-4">
            <button type="button" onClick={() => router.back()}
              className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition">
              Bekor qilish
            </button>
            <button type="submit" disabled={generateMutation.isPending || semesters.length === 0}
              className="flex items-center gap-2 px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold transition">
              <Play className="h-5 w-5" />
              Jadval yaratish
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
