import { Metadata } from "@redwoodjs/web";

import CurrentEventCell from "src/components/CurrentEventCell";
import ParticipationsCell from "src/components/ParticipationsCell";

const ParticipantView = () => {
  return (
    <>
      <Metadata title="Dashboard" description="Home Page" />

      <section className="flex md:flex-row p-6 mx-auto lg:py-0 h-full mt-20">
        <CurrentEventCell />
        <ParticipationsCell></ParticipationsCell>
      </section>
    </>
  )
}

export default ParticipantView;
