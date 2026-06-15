export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY'

export const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY:    'Dushanba',
  TUESDAY:   'Seshanba',
  WEDNESDAY: 'Chorshanba',
  THURSDAY:  'Payshanba',
  FRIDAY:    'Juma',
  SATURDAY:  'Shanba',
}

export type TimetableStatus = 'DRAFT' | 'GENERATING' | 'GENERATED' | 'PUBLISHED' | 'ARCHIVED' | 'FAILED'

export interface Timetable {
  id: string
  name: string
  status: TimetableStatus
  semesterId: string
  solverDurationSeconds?: number
  qualityScore?: QualityScore
  generationStartedAt?: string
  generationCompletedAt?: string
  publishedAt?: string
  createdAt: string
}

export interface TimetableEntry {
  id: string
  timetableId: string
  dayOfWeek: DayOfWeek
  periodNumber: number
  startTime: string
  endTime: string
  subject: SubjectRef
  teacher: TeacherRef
  classroom: ClassroomRef
  studentClass: StudentClassRef
  isPinned: boolean
}

export interface SubjectRef {
  id: string
  name: string
  code: string
  color: string
}

export interface TeacherRef {
  id: string
  name: string
  shortName: string
}

export interface ClassroomRef {
  id: string
  name: string
  typeName: string
}

export interface StudentClassRef {
  id: string
  name: string
  gradeLevel: number
}

export interface QualityScore {
  overallScore: number
  hardScore: number
  softScore: number
  hardConstraintViolations: number
  softConstraintPenalties: number
}

export interface ConstraintViolation {
  constraintType: 'HARD' | 'SOFT'
  constraintName: string
  description: string
  impactScore: number
  affectedEntries: string[]
}

export interface TimetableGenerationStatus {
  status: TimetableStatus
  progressPercent: number
  currentScore?: number
  bestScore?: number
  elapsedSeconds: number
}

export interface GenerateTimetableRequest {
  semesterId: string
  name: string
  solverDurationSeconds: number
  includedClassIds: string[]
  optimizationLevel: 'FAST' | 'BALANCED' | 'THOROUGH'
}

export interface MoveLessonRequest {
  entryId: string
  newDayOfWeek: DayOfWeek
  newPeriodNumber: number
  newClassroomId: string
}

export interface SwapLessonsRequest {
  entryId1: string
  entryId2: string
}

export interface LessonPeriod {
  id: string
  shift: 'FIRST' | 'SECOND'
  periodNumber: number
  startTime: string
  endTime: string
  isActive: boolean
}
