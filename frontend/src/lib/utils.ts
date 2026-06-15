import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('uz-UZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (minutes === 0) return `${remainingSeconds} soniya`
  return `${minutes} daqiqa ${remainingSeconds} soniya`
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export function getQualityColor(score: number): string {
  if (score >= 90) return 'text-green-600 dark:text-green-400'
  if (score >= 75) return 'text-blue-600 dark:text-blue-400'
  if (score >= 60) return 'text-amber-600 dark:text-amber-400'
  if (score >= 40) return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}

export function getQualityLabel(score: number): string {
  if (score >= 90) return 'A\'lo'
  if (score >= 75) return 'Yaxshi'
  if (score >= 60) return 'Qoniqarli'
  if (score >= 40) return 'Yomon'
  return 'Qabul qilib bo\'lmaydi'
}

export function getTimetableStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT:      'Qoralama',
    GENERATING: 'Yaratilmoqda',
    GENERATED:  'Yaratildi',
    PUBLISHED:  'Nashr etildi',
    ARCHIVED:   'Arxivlandi',
    FAILED:     'Xato yuz berdi',
  }
  return labels[status] || status
}

export function getTimetableStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT:      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    GENERATING: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    GENERATED:  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
    PUBLISHED:  'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    ARCHIVED:   'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
    FAILED:     'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}
