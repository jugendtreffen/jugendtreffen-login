import { createContext, useContext, useState } from 'react'

import { AlertProps, generateAlertId } from '@/components/Alert/Alert'

type Alert = {
  id: string
} & AlertProps

type AlertContextType = {
  alerts: Alert[]
  addAlert: (message: string, type?: Alert['type']) => string
  removeAlert: (id: string) => void
  removeAllAlerts: () => void
}

const AlertHook = createContext<AlertContextType | null>(null)

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([])

  const addAlert = (message: string, type?: Alert['type']) => {
    const id = generateAlertId()
    setAlerts([...alerts, { id, message, type }])
    return id
  }

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter((alert: { id: string }) => alert.id !== id))
  }

  const removeAllAlerts = () => {
    setAlerts([])
  }

  return (
    <AlertHook.Provider
      value={{ alerts, addAlert, removeAlert, removeAllAlerts }}
    >
      {children}
    </AlertHook.Provider>
  )
}

export const useAlert = () => {
  const context = useContext(AlertHook)
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}
