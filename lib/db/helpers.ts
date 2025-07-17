// lib/db/helpers.ts
/**
 * Converts empty strings to null for database insertion
 * SQLite and some databases handle NULL better than empty strings
 */
 export function emptyToNull(value: string | undefined | null): string | null {
    if (!value || value.trim() === '') {
      return null;
    }
    return value.trim();
  }
  
  /**
   * Helper to create consistent timestamps for SQLite
   * Ensures timestamps are properly formatted
   */
  export function createTimestamp(): Date {
    return new Date();
  }
  
  /**
   * Safely parse JSON fields from database
   */
  export function parseJsonField<T = any>(field: string | null): T | null {
    if (!field) return null;
    try {
      return JSON.parse(field);
    } catch {
      return null;
    }
  }
  
  /**
   * Safely stringify arrays for JSON storage
   */
  export function stringifyArray(arr: any[] | undefined | null): string | null {
    if (!arr || !Array.isArray(arr) || arr.length === 0) {
      return null;
    }
    return JSON.stringify(arr);
  }