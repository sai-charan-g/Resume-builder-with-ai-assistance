"use client"

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info: (msg) => addToast(msg, 'info'),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        zIndex: 9999,
        pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const iconMap = {
  success: <CheckCircle2 size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
}

const colorMap = {
  success: { bg: 'rgba(22, 163, 74, 0.15)', border: '#16a34a', text: '#16a34a' },
  error: { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: '#ef4444' },
  warning: { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', text: '#f59e0b' },
  info: { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', text: '#3b82f6' },
}

function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(onDismiss, 300)
    }, toast.duration)
    return () => clearTimeout(timer)
  }, [toast.duration, onDismiss])

  const colors = colorMap[toast.type] || colorMap.info

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.875rem 1.25rem',
      borderRadius: 'var(--radius-md, 0.75rem)',
      background: colors.bg,
      backdropFilter: 'blur(16px)',
      border: `1px solid ${colors.border}40`,
      color: colors.text,
      fontSize: '0.9rem',
      fontWeight: 500,
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      pointerEvents: 'auto',
      cursor: 'pointer',
      minWidth: '280px',
      maxWidth: '420px',
      transform: visible && !exiting ? 'translateX(0)' : 'translateX(120%)',
      opacity: visible && !exiting ? 1 : 0,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}
    onClick={onDismiss}
    role="alert"
    >
      {iconMap[toast.type]}
      <span style={{ flex: 1 }}>{toast.message}</span>
      <X size={14} style={{ opacity: 0.6, flexShrink: 0 }} />
    </div>
  )
}
