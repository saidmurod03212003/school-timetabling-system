'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface OpenLesson {
  id: string
  title: string
  subjectName: string
  teacherId: string
  teacherName: string
  date: string
  startTime: string
  endTime: string
  classroom: string
  className: string
  description?: string
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED'
  createdAt: string
  createdBy: string
}

export interface Notification {
  id: string
  lessonId: string
  type: 'OPEN_LESSON_ASSIGNED' | 'OPEN_LESSON_REMINDER' | 'OPEN_LESSON_NEW'
  title: string
  message: string
  targetTeacherId?: string
  createdAt: string
  readBy: string[]
}

interface OpenLessonsState {
  lessons: OpenLesson[]
  notifications: Notification[]

  addLesson: (lesson: Omit<OpenLesson, 'id' | 'createdAt'>) => void
  updateLesson: (id: string, data: Partial<OpenLesson>) => void
  deleteLesson: (id: string) => void

  markNotificationRead: (notificationId: string, userId: string) => void
  getUnreadCount: (userId: string, teacherId?: string) => number
  getNotificationsForUser: (userId: string, teacherId?: string) => Notification[]
}

export const useOpenLessonsStore = create<OpenLessonsState>()(
  persist(
    (set, get) => ({
      lessons: [],
      notifications: [],

      addLesson: (data) => {
        const id = `lesson-${Date.now()}-${Math.random().toString(36).slice(2)}`
        const lesson: OpenLesson = { ...data, id, createdAt: new Date().toISOString() }

        const assignedNotif: Notification = {
          id: `notif-assigned-${id}`,
          lessonId: id,
          type: 'OPEN_LESSON_ASSIGNED',
          title: "Sizga ochiq dars tayinlandi!",
          message: `"${data.title}" — ${data.date}, ${data.startTime}–${data.endTime}, ${data.classroom}`,
          targetTeacherId: data.teacherId,
          createdAt: new Date().toISOString(),
          readBy: [],
        }

        const generalNotif: Notification = {
          id: `notif-general-${id}`,
          lessonId: id,
          type: 'OPEN_LESSON_NEW',
          title: "Yangi ochiq dars e'lon qilindi",
          message: `${data.teacherName}: "${data.title}" — ${data.date}, ${data.startTime}–${data.endTime}`,
          createdAt: new Date().toISOString(),
          readBy: [],
        }

        set(s => ({
          lessons: [lesson, ...s.lessons],
          notifications: [assignedNotif, generalNotif, ...s.notifications],
        }))
      },

      updateLesson: (id, data) => {
        set(s => ({
          lessons: s.lessons.map(l => (l.id === id ? { ...l, ...data } : l)),
        }))
      },

      deleteLesson: (id) => {
        set(s => ({
          lessons: s.lessons.filter(l => l.id !== id),
          notifications: s.notifications.filter(n => n.lessonId !== id),
        }))
      },

      markNotificationRead: (notificationId, userId) => {
        set(s => ({
          notifications: s.notifications.map(n =>
            n.id === notificationId && !n.readBy.includes(userId)
              ? { ...n, readBy: [...n.readBy, userId] }
              : n
          ),
        }))
      },

      getUnreadCount: (userId, teacherId) => {
        const { notifications } = get()
        return notifications.filter(n => {
          if (n.readBy.includes(userId)) return false
          if (n.type === 'OPEN_LESSON_ASSIGNED') return n.targetTeacherId === teacherId
          if (n.type === 'OPEN_LESSON_NEW') return true
          return false
        }).length
      },

      getNotificationsForUser: (userId, teacherId) => {
        const { notifications } = get()
        return notifications.filter(n => {
          if (n.type === 'OPEN_LESSON_ASSIGNED') return n.targetTeacherId === teacherId
          if (n.type === 'OPEN_LESSON_NEW') return true
          return false
        })
      },
    }),
    {
      name: 'open-lessons-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
