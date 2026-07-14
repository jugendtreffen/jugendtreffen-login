import type {
  FindQuartierTableQuery,
  FindQuartierTableQueryVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<
  FindQuartierTableQuery,
  FindQuartierTableQueryVariables
> = gql`
  query FindQuartierTableQuery($id: Int!) {
    quartierTable: quartierTable(id: $id) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindQuartierTableQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  quartierTable,
}: CellSuccessProps<
  FindQuartierTableQuery,
  FindQuartierTableQueryVariables
>) => {
  return <div>{JSON.stringify(quartierTable)}</div>
}
