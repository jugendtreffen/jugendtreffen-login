import type {
  FindCurrentEventQuery,
  FindCurrentEventQueryVariables,
} from 'types/graphql'

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Alert from '@/components/Alert/Alert'
import EventRegistrationForm from '@/components/EventRegistrationForm/EventRegistrationForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card'
import { Skeleton } from 'src/components/ui/skeleton'
import {Button} from "@/components/ui/button";
import {navigate, routes} from "@redwoodjs/router";
import {ArrowLeft} from "lucide-react";

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

type Variant = 'card' | 'date'

type SuccessProps = CellSuccessProps<
  FindCurrentEventQuery,
  FindCurrentEventQueryVariables
>

export const Loading = () => <Skeleton className={'w-full max-w-2xl h-96'} />

export const Empty = () => (
  <Card className="w-full md:w-96">
    <CardHeader className="items-center text-center space-y-3 p-8">
      <CardTitle className="text-2xl font-bold [text-shadow:0_3px_10px_rgba(255,255,255,0.12)]">
        Kein anstehendes Event
      </CardTitle>
      <CardDescription className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        Schau später nochmal vorbei!
      </CardDescription>
      <Button variant="secondary" onClick={() => navigate(routes.home())}>
        <ArrowLeft />
        Zurück
      </Button>
    </CardHeader>
  </Card>
)

export const Failure = ({
  error,
}: CellFailureProps<FindCurrentEventQueryVariables>) => (
    <Alert id={error.name} type="error" message={error.message} dismissible={false} />
)

export const Success = ({ currentEvent }: SuccessProps) => {
  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Anmeldung {currentEvent.name}</CardTitle>
        <CardDescription>{currentEvent.desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <EventRegistrationForm event={currentEvent} />
      </CardContent>
    </Card>
  )
}
