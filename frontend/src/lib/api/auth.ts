import apiClient from './client'
import type {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  Session,
  User,
} from '@/types/auth.types'
import type { ApiResponse } from '@/types/api.types'

export const authApi = {
  login: async (data: LoginRequest) => {
    const res = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data)
    return res.data
  },

  logout: async (refreshToken: string) => {
    await apiClient.post('/auth/logout', { refreshToken })
  },

  refresh: async (refreshToken: string) => {
    const res = await apiClient.post<ApiResponse<LoginResponse>>('/auth/refresh', { refreshToken })
    return res.data
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    await apiClient.post('/auth/forgot-password', data)
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    await apiClient.post('/auth/reset-password', data)
  },

  getMe: async () => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me')
    return res.data.data
  },

  getSessions: async () => {
    const res = await apiClient.get<ApiResponse<Session[]>>('/auth/sessions')
    return res.data.data
  },

  revokeSession: async (sessionId: string) => {
    await apiClient.delete(`/auth/sessions/${sessionId}`)
  },
}
