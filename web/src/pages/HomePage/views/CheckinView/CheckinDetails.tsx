import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {useSidebar} from "@/layouts/SidebarLayout/SidebarLayout";
import ParticipantDetailForm from "@/components/ParticipantDetailForm/ParticipantDetailForm";
import { useQuery } from '@redwoodjs/web'
import {Dialog} from "@/components/ui/dialog";

const GET_PARTICIPANT_QUERY = gql`
  query ParticipantDetailQuery($id: String!) {
    participant(id: $id) {
      id
      name
      familyName
      birthdate
      gender
      email
      phoneNumber
      phoneCaretakerContact
      foundUsBy
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
      checkinConfirmed
      price
      bandColour
      eventId
      event {
        startDate
        endDate
      }
    }
  }
`

const CheckinDetails = () => {
  const {setSubState} = useSidebar()
  const participantId = localStorage.getItem('selectedParticipantId')

  const { data, loading } = useQuery(GET_PARTICIPANT_QUERY, {
    variables: { id: participantId },
  })

  return (
    <Dialog>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => setSubState("Overview")} >Übersicht</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{data?.participant?.name} {data?.participant?.familyName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>


      <ParticipantDetailForm participant={data?.participant} loading={loading} />
    </Dialog>
  );
};

export default CheckinDetails;
