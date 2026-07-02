import React from 'react';
import ParticipantsCell from '@/components/ParticipantsCell/ParticipantsCell'

const CheckinOverview = () => {
  return (
    <>
      <section className="flex flex-col md:flex-row gap-2">
        <ParticipantsCell></ParticipantsCell>
      </section>
    </>
  )
};

export default CheckinOverview;
