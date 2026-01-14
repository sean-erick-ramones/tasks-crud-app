import { ZodError } from 'zod'

export function formatZodError(error: ZodError): string {
  return error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
}

export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}
