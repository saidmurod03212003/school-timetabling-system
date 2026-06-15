export interface User {
  id: string
  email: string
  fullName: string
  phone?: string
  photoUrl?: string
  roles: UserRole[]
  schoolId?: string
  permissions: string[]
  isActive: boolean
}

export type UserRole =
  | 'SUPER_ADMIN'
  | 'SCHOOL_ADMIN'
  | 'ACADEMIC_MANAGER'
  | 'SCHEDULER'
  | 'TEACHER'
  | 'VIEWER'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: User
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface Session {
  id: string
  deviceInfo?: string
  ipAddress?: string
  userAgent?: string
  lastActive: string
  createdAt: string
}
