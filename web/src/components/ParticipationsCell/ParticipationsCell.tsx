import { ArrowRightIcon, Check } from "lucide-react";
import type { ParticipationsQuery, ParticipationsQueryVariables } from "types/graphql";

import type { CellFailureProps, CellSuccessProps, TypedDocumentNode } from "@redwoodjs/web";

import Alert from "src/components/Alert/Alert";
import Card from "src/components/Card/Card";
import Skeleton from "src/components/Skeleton/Skeleton";
import { formatDate } from "src/utils";

export const QUERY: TypedDocumentNode<
  ParticipationsQuery,
  ParticipationsQueryVariables
> = gql`
  query ParticipationsByUserIdQuery($userId: String!) {
    participations(userId: $userId) {
      id
      accommodation
      startDate
      endDate
      foodChoice
      event {
        id
        name
      }
    }
  }
`

const InfoField = ({ label, value }) => {
  return (
    <div className="bg-gradient-to-br from-gray-500/10 to-gray-600/10 border border-gray-500/20 rounded-xl p-3 inline-flex gap-3">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-white font-mono">{value}</p>
    </div>
  )
}

export const Loading = () => (
  <div>
    <Skeleton type="title" className={'h-12 w-3/4 mb-2 mt-4'} />
    <div className="flex flex-col h-full gap-4">
      <Skeleton type="card" />
      <Skeleton type="card" />
      <Skeleton type="card" />
    </div>
  </div>
)

export const Empty = () => (
  <div>
    <h1 className="mb-2">Deine Anmeldungen</h1>
    <Alert
      id={'empty'}
      message={'Du bist nirgends angemeldet'}
      dismissible={false}
    />
  </div>
)

export const Failure = ({
  error,
}: CellFailureProps<ParticipationsQueryVariables>) => (
  <div>
    <h1 className="mb-2">Deine Anmeldungen</h1>
    <Alert
      type={'error'}
      id={error?.name}
      message={error?.message}
      dismissible={false}
    />
  </div>
)

export const Success = ({
  participations,
}: CellSuccessProps<ParticipationsQuery, ParticipationsQueryVariables>) => {
  return (
    <div>
      <h1>Deine Anmeldungen</h1>
      <ul className="flex flex-col gap-4 md:grid-cols-1 md:grid lg:grid-cols-2 xl:grid-cols-3  md:gap-2">
        {participations.map((item) => {
          return (
            <li key={item.id}>
              <Card className="flex flex-col gap-2">
                <h2 className="text-2xl text-green-500">
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-full mr-1">
                    <Check className="w-5 h-5" />
                  </div>
                  {item.event.name}
                </h2>
                <InfoField
                  label="Unterkunft"
                  value={
                    item.accommodation
                      ? 'Bei Jugendtreffen'
                      : 'Private Unterkunft'
                  }
                />
                <InfoField label="Essen" value={item.foodChoice} />

                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-700/30 border border-gray-600/50 rounded-xl p-4 text-center hover:bg-gray-700/40 transition-all duration-300 hover:-translate-y-0.5">
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                      Start
                    </div>
                    <div className="text-base font-semibold text-white mb-1">
                      {formatDate(item.startDate).date}
                    </div>
                  </div>

                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-secondary to-accent-dark rounded-full flex-shrink-0">
                    <ArrowRightIcon></ArrowRightIcon>
                  </div>

                  <div className="flex-1 bg-gray-700/30 border border-gray-600/50 rounded-xl p-4 text-center hover:bg-gray-700/40 transition-all duration-300 hover:-translate-y-0.5">
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                      Ende
                    </div>
                    <div className="text-base font-semibold text-white mb-1">
                      {formatDate(item.endDate).date}
                    </div>
                  </div>
                </div>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
