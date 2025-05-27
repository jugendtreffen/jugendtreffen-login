import type { EventsQuery, EventsQueryVariables } from "types/graphql";

import { routes } from "@redwoodjs/router";
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode
} from "@redwoodjs/web"

import Alert, { generateAlertId } from "src/components/Alert/Alert";
import Card from "src/components/Card/Card";
import LoadingSpinner from "src/components/Loading/LoadingSpinner";

export const QUERY: TypedDocumentNode<EventsQuery, EventsQueryVariables> = gql`
  query EventsQuery {
    events {
      id
      name
      desc
    }
  }
`

export const Loading = () => <LoadingSpinner />;

export const Empty = () => (
  <Alert
    id={generateAlertId()}
    message="No Events found!"
    dismissible={false}
  ></Alert>
);

export const Failure = ({ error }: CellFailureProps) => (
  <Alert
    id={generateAlertId()}
    message={error?.message}
    dismissible={false}
  ></Alert>
)

export const Success = ({ events }: CellSuccessProps<EventsQuery>) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {events.map((item, index) => {
        return (
          <Card
            key={index}
            title={item.name}
            description={item.desc}
            button={{
              message: "Teilnehmen",
              to: routes.events({ id: item.id.toString() })
            }}
          />
        );
      })}
    </div>
  )
}
