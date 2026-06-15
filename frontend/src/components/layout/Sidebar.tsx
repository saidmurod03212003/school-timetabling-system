'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, GraduationCap, X } from 'lucide-react'
import { useState } from 'react'
import { navigation, type NavItem } from '@/config/navigation'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { hasPermission, user } = useAuthStore()
  const [openGroups, setOpenGroups] = useState<string[]>(['Resurslar', 'Dars jadvali'])

  const toggleGroup = (title: string) => {
    setOpenGroups(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    )
  }

  const isActive = (href?: string) => href && pathname === href
  const canShow = (item: NavItem) => !item.permission || hasPermission(item.permission)

  const handleLinkClick = () => onClose()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-72 z-50 flex flex-col',
          'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800',
          'shadow-2xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 rounded-lg p-1.5">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg">Smart Jadval</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.fullName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.filter(canShow).map(item => {
            if (item.children) {
              const visible = item.children.filter(canShow)
              if (visible.length === 0) return null
              const isOpen = openGroups.includes(item.title)
              return (
                <div key={item.title}>
                  <button
                    onClick={() => toggleGroup(item.title)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition"
                  >
                    {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
                    <span className="flex-1 text-left">{item.title}</span>
                    <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
                  </button>
                  {isOpen && (
                    <div className="ml-4 mt-1 space-y-0.5">
                      {visible.map(child => (
                        <Link
                          key={child.href}
                          href={child.href!}
                          onClick={handleLinkClick}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition',
                            isActive(child.href)
                              ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                          )}
                        >
                          {child.icon && <child.icon className="h-4 w-4 flex-shrink-0" />}
                          <span>{child.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition',
                  isActive(item.href)
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
