import * as React from 'react'

type WelcomeEmailProps = {
  name: string
  eventName: string
}

export const WelcomeEmail = ({ name, eventName }: WelcomeEmailProps) => {
  return (
    <html lang="de">
      <h1>Hallo {name}</h1>
      <p>Wir haben dich für das {eventName} erfolgreich Angemeldet!</p>
    </html>
  )
}
