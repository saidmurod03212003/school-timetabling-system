'use client'

import { BookText, AlertCircle } from 'lucide-react'

export default function CurriculumPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">O'quv reja</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Sinf bo'yicha haftalik dars soatlari</p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">O'quv reja uchun ma'lumot kerak</p>
          <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
            O'quv reja tuzish uchun avval: maktab, o'quv yili, semestr, sinflar, fanlar va o'qituvchilar ma'lumotlari kiritilishi kerak.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <BookText className="h-16 w-16 mb-4 opacity-20" />
        <p className="text-xl font-medium mb-2">O'quv reja</p>
        <p className="text-sm text-center max-w-md">
          Har bir sinf uchun qaysi fandan necha soat dars bo'lishi va qaysi o'qituvchi o'qitishini belgilang.
          Bu ma'lumotlar jadval yaratish uchun asosiy talab hisoblanadi.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg">
          {[
            { step: '1', title: 'Maktab sozlamalari', desc: 'Maktab va o\'quv yilini yarating', href: '/schools' },
            { step: '2', title: 'Resurslar', desc: 'Fanlar, sinflar, o\'qituvchilar', href: '/subjects' },
            { step: '3', title: 'Jadval yaratish', desc: 'Avtomatik jadval ishlab chiqing', href: '/timetable/generate' },
          ].map(item => (
            <a key={item.step} href={item.href}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition text-left">
              <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-3">
                {item.step}
              </div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">{item.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
