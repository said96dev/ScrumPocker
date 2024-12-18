import { z } from 'zod'
import { controller } from './type'

export const editRoomSchema = z.object({
  name: z.string().min(4, {
    message: 'Name must be at least 4 characters long',
  }),
  votingId: z.coerce.number(),
  controller: z.nativeEnum(controller),
  reset: z.nativeEnum(controller),
  autoRevealCards: z.boolean(),
  showAveraging: z.boolean(),
  emailAddress: z
    .string()
    .email({ message: 'Invalid email address' })
    .optional(),
  hashedPassword: z
    .string()
    .min(6, 'Passwort muss mindestens 6 Zeichen lang sein')
    .optional(),
  roomId: z.string().min(6, 'roomid muss mindestens 6 Zeichen lang sein'),
})

export type EditRoomType = z.infer<typeof editRoomSchema>
