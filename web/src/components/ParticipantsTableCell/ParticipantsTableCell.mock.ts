// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  participants: [
    {
      __typename: 'Participant' as const,
      id: '42',
      email: 'anna@example.com',
      name: 'Anna',
      familyName: 'Huber',
      birthdate: '2008-03-01',
      checkinConfirmed: true,
    },
    {
      __typename: 'Participant' as const,
      id: '43',
      email: 'ben@example.com',
      name: 'Ben',
      familyName: 'Gruber',
      birthdate: '2009-11-20',
      checkinConfirmed: false,
    },
    {
      __typename: 'Participant' as const,
      id: '44',
      email: 'clara@example.com',
      name: 'Clara',
      familyName: 'Berger',
      birthdate: '2007-07-07',
      checkinConfirmed: false,
    },
  ],
})
