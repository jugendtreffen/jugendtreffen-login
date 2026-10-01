// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  currentEvent: {
    __typename: 'Event' as const,
    id: '1',
    name: 'Jugendtreffen 2026',
    desc: 'Das Jugendtreffen in Kremsmünster',
    startDate: '2026-07-01',
    endDate: '2026-07-05',
  },
})
