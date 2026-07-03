import { Metadata } from '@redwoodjs/web'

import RegistrationOverviewCell from 'src/components/RegistrationOverviewCell'

interface Props {
  id: string  // URL-Parameter: /registration-success/{id}
}

const RegistrationSuccessPage = ({ id }: Props) => {
  return (
    <>
      <Metadata title="Anmeldung bestätigt" />

      <div className="h-24" />

      <div className="flex justify-center p-4">
        <RegistrationOverviewCell id={id} />
      </div>
    </>
  )
}

export default RegistrationSuccessPage
