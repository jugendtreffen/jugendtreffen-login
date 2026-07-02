import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {useSidebar} from "@/layouts/SidebarLayout/SidebarLayout";

type Props = {
  participantId: string
}

const CheckinDetails = ({participantId}: Props) => {
  const {setSubState} = useSidebar()

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => setSubState("Overview")} >Übersicht</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{participantId}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1>{}</h1>
      Detailview id
      <span>{participantId}</span>
    </>
  );
};

export default CheckinDetails;
