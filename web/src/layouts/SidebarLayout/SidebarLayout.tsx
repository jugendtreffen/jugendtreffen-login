import { motion } from 'framer-motion'
import {
  CalendarPlus,
  Home,
  LaptopMinimalCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  X,
} from 'lucide-react'
import React, { createContext, useContext, useEffect, useState } from 'react'
import Footer from 'src/components/Navigation/Footer'
import { useAuth } from 'src/auth'
import { navigate, routes } from '@redwoodjs/router'
import { useAlert } from 'src/components/Alert/AlertContext'
import { useRole } from 'src/roles'
import { isMobile, useForceUpdate } from 'src/utils'

interface SidebarContextType {
  sidebarItem: 'Dashboard' | 'Profil' | 'Anmeldung' | 'Quartier' | 'Checkin'
  setSidebarItem: (item: string) => void
}
const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context)
    throw new Error('useSidebarContext must be used within SidebarLayout')
  return context
}

function getSidebarItemsByRole(role: string) {
  let items = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Profil', icon: User },
    { name: 'Anmeldung', icon: CalendarPlus },
  ]
  switch (role) {
    case 'checkin':
      items.push({ name: 'Checkin', icon: LaptopMinimalCheck })
      break
    case 'quartier':
      items.push({ name: 'Quartier', icon: Home })
      break
  }
  return items
}

type SidebarLayoutProps = {
  children?: React.ReactNode
}

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const [open, setOpen] = useState(!isMobile())
  const [expanded, setExpanded] = useState(true)
  const [selectedItem, setSelectedItem] = useState('Dashboard')
  const { logOut, loading } = useAuth()
  const { addAlert } = useAlert()
  const { role } = useRole()
  const forceUpdate = useForceUpdate()

  const sidebarItems = getSidebarItemsByRole(role)

  const getWidthByState = () => {
    return open ? (expanded ? 240 : 72) : 0
  }

  useEffect(() => {
    const handleResiize = () => {
      if (isMobile()) setExpanded(false)
      forceUpdate()
    }

    window.addEventListener('resize', handleResiize)
    return () => window.removeEventListener('resize', handleResiize)
  })

  return (
    <SidebarContext.Provider
      value={{ sidebarItem: selectedItem, setSidebarItem: setSelectedItem }}
    >
      <div className="flex flex-col h-screen w-screen">
        <div className="flex md:hidden w-full bg-gray-900 text-white p-4 items-center justify-between border-gray-600 border-b">
          <button onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold">
            Jugendtreffen
            <img
              src="/Jugendtreffen-Logo-2.png"
              className="ml-2 h-8"
              alt="Jugendtreffen"
            />
          </h1>
        </div>

        <div className="flex h-full w-screen">
          <motion.aside
            animate={{ width: getWidthByState() }}
            className={`sticky top-0 h-screen flex flex-col ${
              open ? 'border-r' : ''
            } border-gray-600 shadow-md transition-all overflow-hidden`}
          >
            {!isMobile() && (
              <div className="flex items-center justify-between p-4">
                {expanded && (
                  <motion.h2
                    animate={{ display: expanded ? 'inline-block' : 'none' }}
                    className="text-xl font-bold"
                  >
                    Jugendtreffen
                  </motion.h2>
                )}
                <button
                  onClick={() => setExpanded(!expanded)}
                  className={`ml-auto ${!expanded ? 'mx-auto' : ''}`}
                >
                  {expanded ? <PanelLeftClose /> : <PanelLeftOpen />}
                </button>
              </div>
            )}

            <nav className="flex flex-1 flex-col gap-2 p-2">
              {sidebarItems.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  title={name}
                  onClick={() => setSelectedItem(name)}
                  className={`flex items-center rounded-xl px-3 py-2 text-gray-300 hover:bg-gray-700 focus:outline-none ${
                    expanded ? 'gap-3 justify-start' : 'justify-center'
                  } ${selectedItem === name ? 'bg-gray-700 font-bold' : ''}`}
                >
                  <Icon className="h-5 w-5" />
                  {expanded && <span>{name}</span>}
                </button>
              ))}
            </nav>

            <div className="p-2">
              <button
                title="Abmelden"
                onClick={() => {
                  logOut().catch(() => {
                    addAlert('Fehler beim Abmelden', 'error')
                  })
                  navigate(routes.home())
                }}
                disabled={loading}
                className={`flex w-full items-center rounded-xl px-3 py-2 text-accent hover:bg-gray-700 ${
                  expanded ? 'gap-3 justify-start' : 'justify-center'
                }`}
              >
                <LogOut className="h-5 w-5" />
                {expanded && <span>Abmelden</span>}
              </button>
            </div>
          </motion.aside>

          <div
            className="h-full w-full flex flex-col overflow-auto"
            onClick={() => {
              if (isMobile()) setOpen(false)
            }}
          >
            <main className="flex-1 overflow-visible p-6">{children}</main>
            <Footer />
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}

export default SidebarLayout
