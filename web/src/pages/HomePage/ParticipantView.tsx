import { Metadata } from "@redwoodjs/web";

import CurrentEventCell from "src/components/CurrentEventCell";
import { CheckIcon } from "src/components/Icons/Icons";

const ParticipantView = () => {
  return (
    <>
      <Metadata title="Dashboard" description="Home Page" />

      <section className="flex flex-col md:flex-row p-6 mx-auto lg:py-0 h-full mt-20 gap-2">
        <CurrentEventCell></CurrentEventCell>
        <div className="p-6">
          <h1>Deine Anmeldungen:</h1>
          <ul className="flex flex-col gap-2">
            <li>
              <div className="p-4 flex flex-row border rounded-lg shadow bg-gray-800 border-gray-700">
                <span className="text-green-500"><CheckIcon /></span><h2 className="inline ms-2">Jugendtreffen 2025</h2>
              </div>
            </li>
            <li>
              <div className="p-4 flex flex-row border rounded-lg shadow bg-gray-800 border-gray-700">
                <span className="text-green-500"><CheckIcon /></span><h2 className="inline ms-2">Jugendtreffen 2026</h2>
              </div>
            </li>
          </ul>
        </div>

        <ul className="flex flex-col gap-2"></ul>
      </section>
    </>
  )
}

export default ParticipantView;
