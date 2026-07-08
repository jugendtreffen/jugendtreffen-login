import type {
  StaffUsersQuery,
  StaffUsersQueryVariables,
  UpdateStaffRoleMutation,
  UpdateStaffRoleMutationVariables,
} from 'types/graphql'

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'

import Alert from '@/components/ui/Alert/Alert'
import { Skeleton } from '@/components/ui/skeleton'
import StaffRoleForm from '@/components/StaffRoleForm/StaffRoleForm'
import { useAlert } from '@/hooks/AlertHook'
import AlertCenter from "@/components/ui/Alert/AlertCenter";

export const QUERY: TypedDocumentNode<
  StaffUsersQuery,
  StaffUsersQueryVariables
> = gql`
  query StaffUsersQuery {
    staffUsers {
      id
      email
      role
    }
  }
`

const UPDATE_STAFF_ROLE = gql`
  mutation UpdateStaffRoleMutation($input: UpdateStaffRoleInput!) {
    updateStaffRole(input: $input) {
      id
      email
      role
    }
  }
`

export const Loading = () => (
  <div className="space-y-3">
    {[...Array(4)].map((_, i) => (
      <Skeleton key={i} className="h-16 w-full rounded-xl" />
    ))}
  </div>
)

export const Empty = () => (
  <Alert
    id="staff-empty"
    type="error"
    message="Keine Benutzer gefunden."
    dismissible={false}
  />
)

export const Failure = ({
                          error,
                        }: CellFailureProps<StaffUsersQueryVariables>) => (
  <Alert
    id={error.name}
    type="error"
    message={`Fehler beim Laden der Benutzer: ${error.message}`}
    dismissible={false}
  />
)

export const Success = ({
                          staffUsers,
                        }: CellSuccessProps<StaffUsersQuery, StaffUsersQueryVariables>) => {
  const { addAlert } = useAlert()

  const [updateRole, { loading }] = useMutation<
    UpdateStaffRoleMutation,
    UpdateStaffRoleMutationVariables
  >(UPDATE_STAFF_ROLE, {
    onCompleted: () => addAlert(`Rolle erfolgreich aktualisiert`, 'success'),
    onError: (error) => addAlert(`Fehler: ${error.message}`, 'error'),
    refetchQueries: [{ query: QUERY }],
  })

  const handleRoleChange = (userId: string, role: string | null) => {
    updateRole({ variables: { input: { userId, role } } })
  }

  return (
    <div className="space-y-3">
      {staffUsers.map((user) => (
        <StaffRoleForm
          key={user.id}
          user={user}
          onRoleChange={handleRoleChange}
          isSaving={loading}
        />
      ))}
      <AlertCenter />
    </div>
  )
}
