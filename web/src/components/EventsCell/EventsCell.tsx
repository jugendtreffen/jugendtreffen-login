import type { EventsQuery, EventsQueryVariables } from "types/graphql";

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode
} from "@redwoodjs/web";
import Card from "src/components/Card/Card";
import { routes } from "@redwoodjs/router";
import Alert, { generateAlertId } from "src/components/Alert/Alert";

export const QUERY: TypedDocumentNode<EventsQuery, EventsQueryVariables> = gql`
  query EventsQuery {
    events {
      id,
      name,
      desc
    }
  }
`;

export const Loading = () => <div
  className="px-3 py-1 text-xs font-medium leading-none text-center rounded-full animate-pulse bg-blue-900 text-blue-200">loading...</div>;

export const Empty = () => <Alert id={generateAlertId()} message="No Events found!" dismissible={false}></Alert>;

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: "red" }}>Error: {error?.message}</div>
);

export const Success = ({ events }: CellSuccessProps<EventsQuery>) => {
  return (
    <ul>
      {events.map((item, index) => {
        return <Card
          key={index}
          title={item.name}
          description={item.description}
          button={{
            message: "Teilnehmen",
            to: routes.events({ id: item.name.toLocaleLowerCase().replace(/ /g, "-")  })
          }}
        />;
      })}
    </ul>
  );
};
