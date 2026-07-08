import React from 'react';
import ParticipantsTableCell from '@/components/ParticipantsTableCell/ParticipantsTableCell'

const CheckinOverview = () => {
  return (
    <>
      <section className="flex flex-col gap-2 space-y-6">
        <div>
          <h1 className="text-xl font-bold">Checkin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Eine Übersicht aller Teilnehmer. Unter den drei Punkten könne die Details angeschaut und der Checkin bestätigt werden.
          </p>
        </div>
        <ParticipantsTableCell></ParticipantsTableCell>
      </section>
    </>
  )
};

export default CheckinOverview;
