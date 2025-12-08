/**
 * Validates that a redirect URL is safe to use.
 * Only allows relative paths to prevent open redirect vulnerabilities.
 *
 * @param url - The URL to validate
 * @returns true if the URL is safe to redirect to, false otherwise
 */
export function isValidRedirect(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }

  // Reject external URLs (protocol-relative or absolute URLs)
  if (url.includes("//")) {
    return false;
  }

  // Only allow relative paths starting with /
  return url.startsWith("/") && !url.startsWith("//");
}
