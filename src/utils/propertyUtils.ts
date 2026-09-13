/**
 * Utility functions for property publication, visibility status, and local override persistence.
 */

const STORAGE_KEY_PROPERTY_OVERRIDES = 'terrashare_property_overrides';

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

/**
 * Retrieves client-side property modifications (ensures video uploads and edits are persistent)
 */
export function getPropertyOverrides(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROPERTY_OVERRIDES);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Error reading property overrides from storage:', e);
    return {};
  }
}

/**
 * Saves or updates property override data locally
 */
export function savePropertyOverride(idOrSlug: string, updates: Record<string, any>) {
  if (typeof window === 'undefined' || !idOrSlug) return;
  try {
    const current = getPropertyOverrides();
    const existing = current[idOrSlug] || {};
    
    const merged = {
      ...existing,
      ...updates,
      type_details: {
        ...(typeof existing.type_details === 'object' ? existing.type_details : {}),
        ...(typeof updates.type_details === 'object' ? updates.type_details : {}),
      },
    };

    current[idOrSlug] = merged;
    if (updates.id && updates.id !== idOrSlug) {
      current[updates.id] = merged;
    }
    if (updates.slug && updates.slug !== idOrSlug) {
      current[updates.slug] = merged;
    }

    localStorage.setItem(STORAGE_KEY_PROPERTY_OVERRIDES, JSON.stringify(current));
  } catch (e) {
    console.error('Error saving property override to storage:', e);
  }
}

/**
 * Merges a database property record with any local overrides (e.g. newly attached videos)
 */
export function getMergedProperty(property: any): any {
  if (!property) return property;
  const overrides = getPropertyOverrides();
  const override = overrides[property.id] || overrides[property.slug];
  if (!override) return property;

  return {
    ...property,
    ...override,
    type_details: {
      ...(typeof property.type_details === 'object' ? property.type_details : {}),
      ...(typeof override.type_details === 'object' ? override.type_details : {}),
    },
    image_urls: override.image_urls || property.image_urls,
  };
}

/**
 * Merges an array of properties with any local overrides
 */
export function getMergedPropertyList(properties: any[]): any[] {
  if (!Array.isArray(properties)) return [];
  const overrides = getPropertyOverrides();
  if (Object.keys(overrides).length === 0) return properties;

  return properties.map(prop => {
    const override = overrides[prop.id] || overrides[prop.slug];
    if (!override) return prop;

    return {
      ...prop,
      ...override,
      type_details: {
        ...(typeof prop.type_details === 'object' ? prop.type_details : {}),
        ...(typeof override.type_details === 'object' ? override.type_details : {}),
      },
      image_urls: override.image_urls || prop.image_urls,
    };
  });
}
