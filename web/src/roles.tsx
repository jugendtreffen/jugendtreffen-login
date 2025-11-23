import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './auth'
import { useQuery } from '@redwoodjs/web'

const ROLE_QUERY = gql`
  query RoleQuery {
    role
  }
`

type RoleContextType = {
  role: string | null
  loading: boolean
}

const RoleContext = createContext<RoleContextType>({
  role: null,
  loading: true,
})

export const useRole = () => useContext(RoleContext)

export const RoleProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [role, setRole] = useState<string | null>(null)

  const { data, loading } = useQuery(ROLE_QUERY, {
    skip: !isAuthenticated,
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (data?.role) {
      setRole(data.role)
    } else if (!isAuthenticated) {
      setRole(null)
    }
  }, [data, isAuthenticated])

  return (
    <RoleContext.Provider value={{ role, loading }}>
      {children}
    </RoleContext.Provider>
  )
}
