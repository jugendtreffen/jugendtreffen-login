import type { ReactNode } from 'react'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import { AuthProvider, useAuth } from 'src/auth'
import FatalErrorPage from 'src/pages/FatalErrorPage'
import { RoleProvider } from 'src/roles'
import './index.css'

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
    <SpeedInsights />
  </FatalErrorBoundary>
)

export default App
