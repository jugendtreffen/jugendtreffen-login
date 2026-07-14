import React from 'react';
import {Metadata} from "@redwoodjs/web";
import {useAuth} from "@/auth";

const QuartierView = () => {
  const { currentUser } = useAuth()

  return (
    <>
      <Metadata title="Quartier"/>

      <div>Quartier tbd</div>
    </>
  )
};

export default QuartierView;
