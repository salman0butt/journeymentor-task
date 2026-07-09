import { makeCriteriaSchema } from './schemas'
import type { SearchCriteria } from './types'

export interface ValidationErrors {
  origin?: string
  destination?: string
  departureDate?: string
  returnDate?: string
  passengers?: string
}

export function validateCriteria(c: SearchCriteria, today: string): ValidationErrors {
  const result = makeCriteriaSchema(today).safeParse(c)
  if (result.success) return {}

  const errors: ValidationErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof ValidationErrors | undefined
    if (field && errors[field] === undefined) errors[field] = issue.message
  }
  return errors
}

export function hasErrors(e: ValidationErrors): boolean {
  return Object.keys(e).length > 0
}
