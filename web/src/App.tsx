import type { ReactNode } from 'react'

import { Analytics } from '@vercel/analytics/react'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import FatalErrorPage from 'src/pages/FatalErrorPage'

import { AuthProvider, useAuth } from 'src/auth'

import './index.css'
import { RoleProvider } from 'src/roles'

interface AppProps {
  children?: ReactNode
}

const App = ({ children }: AppProps) => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <AuthProvider>
        <RedwoodApolloProvider useAuth={useAuth}>
          <RoleProvider>{children}</RoleProvider>
        </RedwoodApolloProvider>
      </AuthProvider>
    </RedwoodProvider>
    <Analytics />
  </FatalErrorBoundary>
)

export default App
