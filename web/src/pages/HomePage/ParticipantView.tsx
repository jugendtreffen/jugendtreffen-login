import { Metadata } from "@redwoodjs/web";
import EventsCell from "src/components/EventsCell";

const ParticipantView = () => {
  return (
    <>
      <Metadata title="Dashboard" description="Home Page" />

      <section className="flex flex-col items-center p-6 mx-auto lg:py-0 h-full mt-20">
        <EventsCell />
      </section>
    </>
  );
};

export default ParticipantView;
