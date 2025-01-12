export default function slugify(text: string): string {
    return text
      .toLowerCase()                             // Convert to lowercase
      .trim()                                     // Remove leading/trailing whitespace
      .replace(/[^\w\s-]/g, '')                 // Remove non-word characters (except spaces and hyphens)
      .replace(/[\s_-]+/g, '-')                 // Replace spaces, underscores, and multiple hyphens with a single hyphen
      .replace(/^-+|-+$/g, '');                  // Remove leading and trailing hyphens
  }