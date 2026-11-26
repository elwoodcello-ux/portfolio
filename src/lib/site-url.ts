/**
 * The public URL of the site, used for SEO metadata, the sitemap and share previews.
 * On Vercel this is picked up automatically from your production domain.
 * If you buy a custom domain, it will switch over on its own once it's the production domain,
 * or you can force it by setting NEXT_PUBLIC_SITE_URL in the Vercel project settings.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}
