import type { Prisma, UserRole } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const ADMIN_ID = '11111111-1111-4111-8111-111111111111'
export const CHECKIN_ID = '22222222-2222-4222-8222-222222222222'
export const NEW_USER_ID = '33333333-3333-4333-8333-333333333333'

export const standard = defineScenario<Prisma.UserRoleCreateArgs>({
  userRole: {
    admin: { data: { userId: ADMIN_ID, role: 'admin' } },
    checkin: { data: { userId: CHECKIN_ID, role: 'checkin' } },
    newUser: { data: { userId: NEW_USER_ID, role: 'none' } },
  },
})

export type StandardScenario = ScenarioData<UserRole, 'userRole'>
