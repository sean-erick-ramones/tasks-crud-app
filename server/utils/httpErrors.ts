import { H3Error, createError } from 'h3'
import { ZodError } from 'zod'
import { formatZodError } from '../domain/task/task.validation'

export function badRequest(message: string): H3Error {
  return createError({
    statusCode: 400,
    statusMessage: 'Bad Request',
    message
  })
}

export function notFound(message = 'Resource not found'): H3Error {
  return createError({
    statusCode: 404,
    statusMessage: 'Not Found',
    message
  })
}

export function internalError(message = 'Internal server error'): H3Error {
  return createError({
    statusCode: 500,
    statusMessage: 'Internal Server Error',
    message
  })
}

export function handleZodError(error: ZodError): H3Error {
  return badRequest(formatZodError(error))
}

export function handleError(error: unknown): H3Error {
  if (error instanceof ZodError) {
    return handleZodError(error)
  }
  
  if (error instanceof H3Error) {
    return error
  }
  
  console.error('Unexpected error:', error)
  return internalError()
}
