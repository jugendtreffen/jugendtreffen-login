import type { FindCurrentEventQuery, FindCurrentEventQueryVariables } from "types/graphql";

import { Link, routes } from "@redwoodjs/router";
import type { CellFailureProps, CellSuccessProps, TypedDocumentNode } from "@redwoodjs/web";

import Card from "src/components/Card/Card";
import LoadingSpinner from "src/components/Loading/LoadingSpinner";

export const QUERY: TypedDocumentNode<
  FindCurrentEventQuery,
  FindCurrentEventQueryVariables
> = gql`
  query FindCurrentEventQuery() {
    currentEvent: currentEvent() {
      id,
      name,
      desc,
      startDate,
      endDate,
    }
  }
`;

export const Loading = () => (
  <Card>
    <LoadingSpinner />
  </Card>
);

export const Empty = () => <Card title={"Kein aktuelles Event"}></Card>;

export const Failure = ({
                          error
                        }: CellFailureProps<FindCurrentEventQueryVariables>) => (
  <div style={{ color: "red" }}>Error: {error?.message}</div>
);

export const Success = ({
                          currentEvent
                        }: CellSuccessProps<FindCurrentEventQuery, FindCurrentEventQueryVariables>) => {
  return (
    <Card title={currentEvent.name} description={currentEvent.desc}>
      <Link
        to={routes.events({ id: currentEvent.id })}
        className="primary"
      ></Link>
    </Card>
  );
};
