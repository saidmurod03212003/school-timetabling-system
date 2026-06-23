import {
  LayoutDashboard,
  DoorOpen,
  Users,
  BookOpen,
  GraduationCap,
  Clock,
  BookText,
  Calendar,
  Settings,
  UserCircle,
  Shield,
  BookMarked,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  title: string
  href?: string
  icon?: LucideIcon
  children?: NavItem[]
  permission?: string
  roles?: string[]
  badge?: string
}

export const navigation: NavItem[] = [
  {
    title: 'Asosiy sahifa',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Resurslar',
    icon: BookOpen,
    children: [
      { title: 'Xonalar',       href: '/classrooms',     icon: DoorOpen,      permission: 'classroom:manage' },
      { title: 'Sinflar',       href: '/classes',        icon: Users,         permission: 'school:read' },
      { title: 'Fanlar',        href: '/subjects',       icon: BookOpen,      permission: 'subject:manage' },
      { title: "O'qituvchilar", href: '/teachers',       icon: GraduationCap, permission: 'teacher:read' },
      { title: 'Dars vaqtlari', href: '/lesson-periods', icon: Clock,         permission: 'school:read' },
    ],
  },
  {
    title: "O'quv reja",
    href: '/curriculum',
    icon: BookText,
    permission: 'curriculum:manage',
  },
  {
    title: 'Ochiq darslar',
    href: '/open-lessons',
    icon: BookMarked,
  },
  {
    title: 'Dars jadvali',
    icon: Calendar,
    children: [
      { title: 'Jadvallar',       href: '/timetable',          icon: Calendar, permission: 'timetable:view' },
      { title: 'Jadval yaratish', href: '/timetable/generate', icon: Calendar, permission: 'timetable:generate' },
    ],
  },
  {
    title: 'Sozlamalar',
    icon: Settings,
    children: [
      { title: 'Foydalanuvchilar',  href: '/users',        icon: UserCircle, permission: 'user:manage' },
      { title: 'Rollar',            href: '/users/roles',  icon: Shield,     permission: 'user:manage' },
      { title: 'Tizim sozlamalari', href: '/settings',     icon: Settings,   permission: 'school:update' },
    ],
  },
]
