import React from 'react';
import {Metadata} from "@redwoodjs/web";
import {useAuth} from "@/auth";
import QuartierTableCell from "@/components/QuartierTableCell/QuartierTableCell"

const QuartierView = () => {
  const { currentUser } = useAuth()
  const role = currentUser.roles.at(0)
  const accommodationGender = role.split("_").at(1) == 'boys' ? 'male' : 'female'
  const accommodationLocation = 'jugendtreffen'

  return (
    <>
      <Metadata title="Quartier" />

      <QuartierTableCell gender={accommodationGender} location={accommodationLocation}/>
    </>
  )
};

export default QuartierView;
