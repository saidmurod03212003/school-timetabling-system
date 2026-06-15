import { create } from 'zustand'
import type { TimetableEntry, DayOfWeek } from '@/types/timetable.types'

interface TimetableEdit {
  type: 'MOVE' | 'SWAP' | 'PIN'
  entryId: string
  previousState: Partial<TimetableEntry>
  newState: Partial<TimetableEntry>
}

interface TimetableState {
  entries: TimetableEntry[]
  selectedEntryId: string | null
  conflictEntryIds: Set<string>
  editHistory: TimetableEdit[]
  redoStack: TimetableEdit[]
  isEditing: boolean
  hasUnsavedChanges: boolean
  viewMode: 'class' | 'teacher' | 'classroom' | 'all'
  selectedEntityId: string | null

  setEntries: (entries: TimetableEntry[]) => void
  updateEntry: (id: string, updates: Partial<TimetableEntry>) => void
  selectEntry: (id: string | null) => void
  markConflicts: (ids: string[]) => void
  clearConflicts: () => void
  recordEdit: (edit: TimetableEdit) => void
  undo: () => TimetableEdit | null
  redo: () => TimetableEdit | null
  setViewMode: (mode: TimetableState['viewMode'], entityId?: string) => void
  setEditing: (editing: boolean) => void
  reset: () => void
}

const MAX_HISTORY = 20

export const useTimetableStore = create<TimetableState>()((set, get) => ({
  entries: [],
  selectedEntryId: null,
  conflictEntryIds: new Set(),
  editHistory: [],
  redoStack: [],
  isEditing: false,
  hasUnsavedChanges: false,
  viewMode: 'all',
  selectedEntityId: null,

  setEntries: (entries) => set({ entries, hasUnsavedChanges: false }),

  updateEntry: (id, updates) =>
    set((state) => ({
      entries: state.entries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      hasUnsavedChanges: true,
    })),

  selectEntry: (id) => set({ selectedEntryId: id }),

  markConflicts: (ids) => set({ conflictEntryIds: new Set(ids) }),

  clearConflicts: () => set({ conflictEntryIds: new Set() }),

  recordEdit: (edit) =>
    set((state) => {
      const history = [edit, ...state.editHistory].slice(0, MAX_HISTORY)
      return { editHistory: history, redoStack: [], hasUnsavedChanges: true }
    }),

  undo: () => {
    const { editHistory } = get()
    if (editHistory.length === 0) return null
    const [latest, ...rest] = editHistory
    set((state) => ({
      editHistory: rest,
      redoStack: [latest, ...state.redoStack],
    }))
    return latest
  },

  redo: () => {
    const { redoStack } = get()
    if (redoStack.length === 0) return null
    const [next, ...rest] = redoStack
    set((state) => ({
      redoStack: rest,
      editHistory: [next, ...state.editHistory],
    }))
    return next
  },

  setViewMode: (mode, entityId) =>
    set({ viewMode: mode, selectedEntityId: entityId ?? null }),

  setEditing: (editing) => set({ isEditing: editing }),

  reset: () =>
    set({
      entries: [],
      selectedEntryId: null,
      conflictEntryIds: new Set(),
      editHistory: [],
      redoStack: [],
      isEditing: false,
      hasUnsavedChanges: false,
    }),
}))
