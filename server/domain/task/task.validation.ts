import { ZodError, z } from 'zod'

export function formatZodError(error: ZodError): string {
  return error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
}

export function isValidUUID(id: string): boolean {
  return z.uuid().safeParse(id).success
}
