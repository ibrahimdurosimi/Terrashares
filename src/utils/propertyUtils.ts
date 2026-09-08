/**
 * Utility functions for property publication and visibility status.
 */

export function isPropertyPublished(property: any): boolean {
  if (!property) return false;
  
  // 1. Direct column if added in schema
  if (typeof property.is_published === 'boolean') {
    return property.is_published;
  }
  
  // 2. Stored in type_details JSONB
  const details = property.type_details;
  if (details && typeof details === 'object') {
    if (details.is_published === false || details.published === false) {
      return false;
    }
  }
  
  // Default to true for existing properties without explicit unpublish flag
  return true;
}
