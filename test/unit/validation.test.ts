import { describe, it, expect } from 'vitest';
import { formatZodError, isValidUUID } from '../../server/domain/task/task.validation';
import { z } from 'zod';

describe('validation helpers', () => {
  describe('formatZodError', () => {
    it('should format single validation error', () => {
      const schema = z.object({ name: z.string().min(3) });
      try {
        schema.parse({ name: 'ab' });
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formatted = formatZodError(error);
          expect(formatted).toContain('name');
          expect(formatted).toContain('expected string to have >=3 characters');
        }
      }
    });

    it('should format multiple validation errors', () => {
      const schema = z.object({
        name: z.string().min(3),
        age: z.number().min(18),
      });
      try {
        schema.parse({ name: 'ab', age: 10 });
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formatted = formatZodError(error);
          expect(formatted).toContain('name');
          expect(formatted).toContain('age');
        }
      }
    });
  });

  describe('isValidUUID', () => {
    it('should validate correct UUID v4', () => {
      const validUUID = '123e4567-e89b-42d3-a456-426614174000';
      expect(isValidUUID(validUUID)).toBe(true);
    });

    it('should reject invalid UUID format', () => {
      expect(isValidUUID('not-a-uuid')).toBe(false);
      expect(isValidUUID('123e4567-89b-12d3-456-424174000')).toBe(false); // wrong version
      expect(isValidUUID('')).toBe(false);
    });

    it('should accept crypto.randomUUID() output', () => {
      const uuid = crypto.randomUUID();
      expect(isValidUUID(uuid)).toBe(true);
    });
  });
});
