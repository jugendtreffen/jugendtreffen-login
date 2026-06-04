import type {
  ParticipantsQuery,
  ParticipantsQueryVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<
  ParticipantsQuery,
  ParticipantsQueryVariables
> = gql`
  query ParticipantsQuery {
    participants {
      id
      email
      name
      familyName
      birthdate
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<ParticipantsQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  participants,
}: CellSuccessProps<ParticipantsQuery, ParticipantsQueryVariables>) => {
  return (
    <ul>
      {participants.map((item) => {
        return <li key={item.id}>{JSON.stringify(item)}</li>
      })}
    </ul>
  )
}
