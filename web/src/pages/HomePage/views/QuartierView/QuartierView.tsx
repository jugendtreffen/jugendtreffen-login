import React from 'react';
import {Metadata} from "@redwoodjs/web";
import {useAuth} from "@/auth";
import QuartierTableCell from "@/components/QuartierTableCell/QuartierTableCell"

const QuartierView = () => {
  const { currentUser } = useAuth()
  const role = currentUser.roles.at(0)
  const accommodationGender = role.split("_").at(1) == 'boys' ? 'female' : 'male'
  const accommodationLocation = 'jugendtreffen'
  console.log(accommodationGender)
  return (
    <>
      <Metadata title="Quartier" />

      <section className="flex flex-col gap-2 space-y-6">
        <div>
          <h1 className="text-xl font-bold">Quartier {accommodationGender == 'male' ? "Burschen" : "Mädchen"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Eine Übersicht aller Teilnehmer. Unter den drei Punkten könne die Details angeschaut und der Checkin bestätigt werden.
          </p>
        </div>
        <QuartierTableCell gender={accommodationGender} location={accommodationLocation} />
      </section>
    </>
  )
};

export default QuartierView;
