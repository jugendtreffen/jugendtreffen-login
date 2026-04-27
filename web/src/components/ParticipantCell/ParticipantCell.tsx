import { CheckCircle2 } from 'lucide-react'
import type {
  FindParticipantQuery,
  FindParticipantQueryVariables,
} from 'types/graphql'

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Alert from '@/components/Alert/Alert'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card'
import { Skeleton } from 'src/components/ui/skeleton'

export const QUERY: TypedDocumentNode<
  FindParticipantQuery,
  FindParticipantQueryVariables
> = gql`
  query FindParticipantQuery($id: String!) {
    participant(id: $id) {
      id
      name
      familyName
      birthdate
      gender
      phoneNumber
      country
      city
      postalCode
      address
      travelMethod
      accommodation
      startDate
      endDate
      foodChoice
      acceptPhotos
      acceptCoC
      participationRole
      event {
        id
        name
        startDate
        endDate
      }
    }
  }
`

export const Loading = () => (
  <div className="w-full max-w-2xl space-y-4">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-64 w-full" />
  </div>
)

export const Empty = () => (
  <Alert
    id="not-found"
    type="error"
    message="Anmeldung nicht gefunden. Bitte überprüfe den Link."
    dismissible={false}
  />
)

export const Failure = ({
                          error,
                        }: CellFailureProps<FindParticipantQueryVariables>) => (
  <Alert
    id={error.name}
    type="error"
    message={`Bitte versuche es später erneut: ${error.name}`}
    dismissible={false}
  />
)

type SummaryRow = { label: string; value: string | boolean | null | undefined }

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('de-AT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

const yesNo = (val: boolean) => (val ? 'Ja' : 'Nein')

export const Success = ({
                          participant,
                        }: CellSuccessProps<
  FindParticipantQuery,
  FindParticipantQueryVariables
>) => {
  const rows: SummaryRow[] = [
    { label: 'Vorname', value: participant.name },
    { label: 'Nachname', value: participant.familyName },
    { label: 'Geburtsdatum', value: formatDate(participant.birthdate) },
    { label: 'Geschlecht', value: participant.gender },
    { label: 'Telefon', value: participant.phoneNumber },
    { label: 'Land', value: participant.country },
    { label: 'Stadt', value: participant.city },
    { label: 'PLZ', value: participant.postalCode },
    { label: 'Adresse', value: participant.address },
    { label: 'Anreise', value: participant.travelMethod ?? '–' },
    { label: 'Unterkunft', value: participant.accommodation },
    { label: 'Anwesenheit von', value: formatDate(participant.startDate) },
    { label: 'Anwesenheit bis', value: formatDate(participant.endDate) },
    { label: 'Essenwahl', value: participant.foodChoice },
    { label: 'Rolle', value: participant.participationRole ?? '–' },
    { label: 'Fotos erlaubt', value: yesNo(participant.acceptPhotos) },
    { label: 'CoC akzeptiert', value: yesNo(participant.acceptCoC) },
  ]

  return (
    <div className="w-full max-w-2xl space-y-6">
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          <div>
            <CardTitle className="text-xl text-green-800 dark:text-green-300">
              Anmeldung erfolgreich!
            </CardTitle>
            <p className="text-sm text-green-700 dark:text-green-400">
              Du bist für{' '}
              <strong>{participant.event.name}</strong> angemeldet.
            </p>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deine Anmeldedaten</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-border">
            {rows.map(({ label, value }) => (
              <div
                key={label}
                className="grid grid-cols-2 gap-4 py-2 text-sm"
              >
                <dt className="font-medium text-muted-foreground">{label}</dt>
                <dd>{String(value)}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
