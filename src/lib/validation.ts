// src/lib/validation.ts - Validation utilities
import { z } from 'zod'

// Memory validation schemas
export const memorySchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  description: z.string()
    .min(1, 'Description is required')
    .max(2000, 'Description must be less than 2000 characters')
    .trim(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  category: z.string().optional(),
  year: z.string().optional(),
  occasion: z.string().optional()
})

export const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional()
})

// Type-safe validation functions
export function validateMemory(data: unknown) {
  try {
    return {
      success: true as const,
      data: memorySchema.parse(data),
      errors: null
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false as const,
        data: null,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }
    }
    return {
      success: false as const,
      data: null,
      errors: [{ field: 'unknown', message: 'Validation failed' }]
    }
  }
}

export function validateEmail(data: unknown) {
  try {
    return {
      success: true as const,
      data: emailSchema.parse(data),
      errors: null
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false as const,
        data: null,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }
    }
    return {
      success: false as const,
      data: null,
      errors: [{ field: 'unknown', message: 'Validation failed' }]
    }
  }
}

// Runtime type checking utilities
export function isValidArray<T>(value: unknown, itemValidator?: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && (
    !itemValidator || value.every(itemValidator)
  )
}

export function isValidString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value)
}

export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime())
}

// Safe data access utilities
export function safeAccess<T>(
  obj: unknown,
  path: string[],
  defaultValue: T
): T {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = obj
    for (const key of path) {
      if (current == null || typeof current !== 'object') {
        return defaultValue
      }
      current = current[key]
    }
    return current ?? defaultValue
  } catch {
    return defaultValue
  }
}

// Memory-specific validation helpers
export function validateMemoryArray(data: unknown): data is Array<Record<string, unknown>> {
  return isValidArray(data) && data.every(item => 
    typeof item === 'object' && 
    item !== null &&
    typeof (item as Record<string, unknown>)._id === 'string' &&
    typeof (item as Record<string, unknown>).title === 'string'
  )
}

export function sanitizeMemoryData(memory: Record<string, unknown>) {
  return {
    _id: safeAccess(memory, ['_id'], ''),
    title: safeAccess(memory, ['title'], 'Untitled'),
    description: safeAccess(memory, ['description'], ''),
    imageUrl: safeAccess(memory, ['imageUrl'], null),
    authorName: safeAccess(memory, ['authorName'], 'Anonymous'),
    authorImage: safeAccess(memory, ['authorImage'], null),
    likes: safeAccess(memory, ['likes'], 0),
    comments: safeAccess(memory, ['comments'], []),
    likedBy: safeAccess(memory, ['likedBy'], []),
    createdAt: safeAccess(memory, ['createdAt'], new Date().toISOString()),
    year: safeAccess(memory, ['year'], null),
    occasion: safeAccess(memory, ['occasion'], null)
  }
}