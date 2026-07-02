import React from 'react';
import {Metadata} from "@redwoodjs/web";
import ParticipantsCell from "@/components/ParticipantsCell/ParticipantsCell";

const CheckinView = () => {
  return (
    <>
      <Metadata title="Checkin"/>

      <section className="flex flex-col md:flex-row gap-2">
        <ParticipantsCell></ParticipantsCell>
      </section>
    </>
  )
};

export default CheckinView;
