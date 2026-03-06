import { Metadata } from '@redwoodjs/web'
import CurrentEventCell from 'src/components/CurrentEventCell'

const EventRegistrationPage = () => {
  return (
    <>
      <Metadata title="Jugendtreffen-Anmeldung" />

      <div className="h-24"></div>

      <div className="flex justify-center mb-4">
        <CurrentEventCell />
      </div>
    </>
  )
}

export default EventRegistrationPage
