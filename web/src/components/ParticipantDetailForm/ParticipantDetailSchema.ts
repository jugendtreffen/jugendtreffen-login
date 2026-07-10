import { z } from 'zod'

export const EditSchema = z.object({
  name: z.string().min(1),
  familyName: z.string().min(1),
  email: z.string().email(),
  birthdate: z.coerce.date(),
  gender: z.string().min(1),
  phoneNumber: z.string().min(1),
  phoneCaretakerContact: z.string().optional().nullable(),
  country: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  address: z.string().min(1),
  travelMethod: z.string().optional().nullable(),
  participationRole: z.string().optional().nullable(),
  accommodation: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  foodChoice: z.string().min(1),
  acceptPhotos: z.boolean(),
  acceptCoC: z.boolean(),
  foundUsBy: z.string().optional().nullable(),
  isParent: z.boolean(),
  ageChecked: z.boolean(),
  parentConfirmationChecked: z.boolean(),
  checkinConfirmed: z.boolean()
})

export type EditInput = z.infer<typeof EditSchema>
