import type { ReactElement, ReactNode } from 'react'

import { render } from '@redwoodjs/testing/web'

import { AlertProvider } from '@/hooks/AlertHook'
import { CurrentEventProvider } from '@/hooks/CurrenteventHook'
import SidebarLayout from '@/layouts/SidebarLayout/SidebarLayout'

type Options = {
  /** Zusätzlich in SidebarLayout einbetten (für Komponenten, die useSidebar nutzen) */
  withSidebar?: boolean
}

/**
 * Stellt die Provider bereit, die in der App von GlobalLayout gesetzt werden
 * (AlertProvider, CurrentEventProvider) und optional den SidebarLayout-Context.
 */
export const TestProviders = ({
  children,
  withSidebar = false,
}: Options & { children: ReactNode }) => (
  <AlertProvider>
    <CurrentEventProvider>
      {withSidebar ? <SidebarLayout>{children}</SidebarLayout> : children}
    </CurrentEventProvider>
  </AlertProvider>
)

export const renderWithProviders = (ui: ReactElement, options: Options = {}) =>
  render(<TestProviders {...options}>{ui}</TestProviders>)
