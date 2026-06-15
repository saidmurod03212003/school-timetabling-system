import { useState, useCallback } from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

interface ToastState {
  toasts: Toast[]
}

let toastId = 0
const listeners: Array<(state: ToastState) => void> = []
let memoryState: ToastState = { toasts: [] }

function dispatch(state: ToastState) {
  memoryState = state
  listeners.forEach((listener) => listener(memoryState))
}

export function toast(props: Omit<Toast, 'id'>) {
  const id = String(++toastId)
  const newToast: Toast = { id, duration: 4000, ...props }
  dispatch({ toasts: [newToast, ...memoryState.toasts].slice(0, 5) })
  setTimeout(() => {
    dispatch({ toasts: memoryState.toasts.filter((t) => t.id !== id) })
  }, newToast.duration)
  return id
}

export function useToast() {
  const [state, setState] = useState<ToastState>(memoryState)

  const subscribe = useCallback(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return {
    toasts: state.toasts,
    toast,
    dismiss: (id: string) => {
      dispatch({ toasts: memoryState.toasts.filter((t) => t.id !== id) })
    },
  }
}
