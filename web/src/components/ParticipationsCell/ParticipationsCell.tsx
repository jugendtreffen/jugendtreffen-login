import type { ParticipationsQuery, ParticipationsQueryVariables } from "types/graphql";

import type { CellFailureProps, CellSuccessProps, TypedDocumentNode } from "@redwoodjs/web";

export const QUERY: TypedDocumentNode<
  ParticipationsQuery,
  ParticipationsQueryVariables
> = gql`
  query participationsByUserId($userId: String!) {}
    participations {
      id
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Empty</div>;

export const Failure = ({
                          error
                        }: CellFailureProps<ParticipationsQueryVariables>) => (
  <div style={{ color: "red" }}>Error: {error?.message}</div>
);

export const Success = ({
                          participations
                        }: CellSuccessProps<ParticipationsQuery, ParticipationsQueryVariables>) => {
  return (
    <ul>
      {participations.map((item) => {
        return <li key={item.id}>{JSON.stringify(item)}</li>;
      })}
    </ul>
  );
};
