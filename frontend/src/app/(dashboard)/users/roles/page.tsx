'use client'

import { Shield } from 'lucide-react'

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rollar</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Foydalanuvchi rollari va ruxsatlar</p>
      </div>
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <Shield className="h-16 w-16 mb-4 opacity-20" />
        <p className="text-xl font-medium text-gray-500">Tez kunda</p>
        <p className="text-sm mt-2">Bu bo'lim hozirda ishlab chiqilmoqda</p>
      </div>
    </div>
  )
}
