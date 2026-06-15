export interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: PageMeta
  error?: ErrorDetail
  timestamp: string
}

export interface PageMeta {
  total: number
  page: number
  size: number
  totalPages: number
}

export interface ErrorDetail {
  code: string
  message: string
}

export type SortOrder = 'asc' | 'desc'

export interface PaginationParams {
  page?: number
  size?: number
  sort?: string
  search?: string
}
