import { createContext, useContext, type PropsWithChildren } from 'react'

import type { TypedDocumentNode } from '@graphql-typed-document-node/core'

import type {
  FindCurrentEventQuery,
  FindCurrentEventQueryVariables,
} from 'types/graphql'
import { useQuery } from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<
  FindCurrentEventQuery,
  FindCurrentEventQueryVariables
> = gql`
  query FindCurrentEventQuery {
    currentEvent {
      id
      name
      desc
      startDate
      endDate
    }
  }
`

type CurrentEvent = NonNullable<FindCurrentEventQuery['currentEvent']>

type CurrentEventContextValue = {
  currentEvent: CurrentEvent | null
  loading: boolean
  error?: Error
  refetch: () => void
}

const CurrentEventContext = createContext<CurrentEventContextValue | undefined>(
  undefined
)

export const CurrentEventProvider = ({ children }: PropsWithChildren) => {
  const { data, loading, error, refetch } = useQuery(QUERY)

  console.log('CurrentEventProvider', data, loading, error)

  const value: CurrentEventContextValue = {
    currentEvent: data?.currentEvent ?? null,
    loading,
    error,
    refetch: () => {
      void refetch()
    },
  }

  return (
    <CurrentEventContext.Provider value={value}>
      {children}
    </CurrentEventContext.Provider>
  )
}

export const useCurrentEvent = () => {
  const context = useContext(CurrentEventContext)

  if (!context) {
    throw new Error(
      'useCurrentEvent must be used within a CurrentEventProvider'
    )
  }

  return context
}
