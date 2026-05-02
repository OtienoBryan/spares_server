import { Controller, Get, Header } from '@nestjs/common';
import { ProductsService } from './products.service';

const SITE_URL = (process.env.SITE_URL || 'https://precisionparts.co.ke').replace(/\/+$/, '');

@Controller('api/sitemap.xml')
export class SitemapController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Header('Content-Type', 'application/xml; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=3600, s-maxage=3600')
  async getSitemap(): Promise<string> {
    const today = new Date().toISOString().split('T')[0];

    const [products, categories, makes] = await Promise.all([
      this.productsService.findAll().catch(() => []),
      this.productsService.getCategories().catch(() => []),
      this.productsService.getVehicleMakes().catch(() => []),
    ]);

    const urls: string[] = [];

    const url = (loc: string, priority: string, freq: string, lastmod = today) =>
      `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

    // Static pages
    urls.push(url(`${SITE_URL}/`, '1.0', 'daily'));
    urls.push(url(`${SITE_URL}/offers`, '0.9', 'daily'));
    urls.push(url(`${SITE_URL}/featured`, '0.9', 'daily'));
    urls.push(url(`${SITE_URL}/catalog`, '0.8', 'daily'));
    urls.push(url(`${SITE_URL}/brands`, '0.8', 'weekly'));
    urls.push(url(`${SITE_URL}/makes`, '0.8', 'weekly'));
    urls.push(url(`${SITE_URL}/contact`, '0.6', 'monthly'));

    // Category pages
    for (const cat of categories) {
      if (cat.name && (cat as any).isActive !== false) {
        urls.push(url(`${SITE_URL}/category/${encodeURIComponent(cat.name.toLowerCase())}`, '0.9', 'daily'));
      }
    }

    // Vehicle make pages
    for (const make of makes) {
      urls.push(url(`${SITE_URL}/make/${make.id}`, '0.8', 'weekly'));
    }

    // Unique brand pages
    const brands = new Set<string>();
    for (const p of products) {
      if ((p as any).brand) brands.add((p as any).brand);
    }
    for (const brand of brands) {
      urls.push(url(`${SITE_URL}/brands/${encodeURIComponent(brand)}`, '0.8', 'weekly'));
    }

    // Product pages
    for (const product of products) {
      if ((product as any).isActive !== false) {
        const slug = `${(product as any).name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${(product as any).id}`;
        const lastmod = (product as any).updatedAt
          ? new Date((product as any).updatedAt).toISOString().split('T')[0]
          : today;
        urls.push(url(`${SITE_URL}/product/${slug}`, '0.9', 'weekly', lastmod));
      }
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.join('\n')}
</urlset>`;
  }
}
