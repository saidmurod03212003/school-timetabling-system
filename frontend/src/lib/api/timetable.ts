import apiClient from './client'
import type {
  Timetable,
  TimetableEntry,
  TimetableGenerationStatus,
  ConstraintViolation,
  QualityScore,
  GenerateTimetableRequest,
  MoveLessonRequest,
  SwapLessonsRequest,
} from '@/types/timetable.types'
import type { ApiResponse, PageMeta } from '@/types/api.types'

const base = (schoolId: string) => `/schools/${schoolId}/timetables`

export const timetableApi = {
  list: async (schoolId: string, semesterId?: string) => {
    const params = semesterId ? { semesterId } : {}
    const res = await apiClient.get<ApiResponse<Timetable[]>>(base(schoolId), { params })
    return res.data.data
  },

  get: async (schoolId: string, id: string) => {
    const res = await apiClient.get<ApiResponse<Timetable>>(`${base(schoolId)}/${id}`)
    return res.data.data
  },

  generate: async (schoolId: string, data: GenerateTimetableRequest) => {
    const res = await apiClient.post<ApiResponse<{ timetableId: string; status: string }>>(
      `${base(schoolId)}/generate`,
      data
    )
    return res.data.data
  },

  getStatus: async (schoolId: string, id: string) => {
    const res = await apiClient.get<ApiResponse<TimetableGenerationStatus>>(
      `${base(schoolId)}/${id}/status`
    )
    return res.data.data
  },

  getEntries: async (
    schoolId: string,
    id: string,
    filters?: { classId?: string; teacherId?: string; classroomId?: string }
  ) => {
    const res = await apiClient.get<ApiResponse<TimetableEntry[]>>(
      `${base(schoolId)}/${id}/entries`,
      { params: filters }
    )
    return res.data.data
  },

  getEntriesByClass: async (schoolId: string, id: string, classId: string) => {
    const res = await apiClient.get<ApiResponse<TimetableEntry[]>>(
      `${base(schoolId)}/${id}/by-class/${classId}`
    )
    return res.data.data
  },

  getEntriesByTeacher: async (schoolId: string, id: string, teacherId: string) => {
    const res = await apiClient.get<ApiResponse<TimetableEntry[]>>(
      `${base(schoolId)}/${id}/by-teacher/${teacherId}`
    )
    return res.data.data
  },

  publish: async (schoolId: string, id: string) => {
    await apiClient.post(`${base(schoolId)}/${id}/publish`)
  },

  moveLesson: async (schoolId: string, id: string, data: MoveLessonRequest) => {
    const res = await apiClient.post<ApiResponse<TimetableEntry>>(
      `${base(schoolId)}/${id}/entries/move`,
      data
    )
    return res.data.data
  },

  swapLessons: async (schoolId: string, id: string, data: SwapLessonsRequest) => {
    await apiClient.post(`${base(schoolId)}/${id}/entries/swap`, data)
  },

  pinLesson: async (schoolId: string, timetableId: string, entryId: string, isPinned: boolean) => {
    await apiClient.patch(`${base(schoolId)}/${timetableId}/entries/${entryId}/pin`, { isPinned })
  },

  getViolations: async (schoolId: string, id: string) => {
    const res = await apiClient.get<ApiResponse<ConstraintViolation[]>>(
      `${base(schoolId)}/${id}/violations`
    )
    return res.data.data
  },

  getQualityScore: async (schoolId: string, id: string) => {
    const res = await apiClient.get<ApiResponse<QualityScore>>(
      `${base(schoolId)}/${id}/quality-score`
    )
    return res.data.data
  },

  exportTimetable: async (
    schoolId: string,
    id: string,
    format: 'PDF' | 'EXCEL' | 'CSV',
    type: 'BY_CLASS' | 'BY_TEACHER' | 'BY_CLASSROOM' | 'FULL_SCHOOL',
    entityId?: string
  ) => {
    const params: Record<string, string> = { format, type }
    if (entityId) {
      if (type === 'BY_CLASS') params.classId = entityId
      if (type === 'BY_TEACHER') params.teacherId = entityId
      if (type === 'BY_CLASSROOM') params.classroomId = entityId
    }
    const res = await apiClient.get(`${base(schoolId)}/${id}/export`, {
      params,
      responseType: 'blob',
    })
    return res.data
  },
}
