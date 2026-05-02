"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitemapController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const SITE_URL = (process.env.SITE_URL || 'https://precisionparts.co.ke').replace(/\/+$/, '');
let SitemapController = class SitemapController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    async getSitemap() {
        const today = new Date().toISOString().split('T')[0];
        const [products, categories, makes] = await Promise.all([
            this.productsService.findAll().catch(() => []),
            this.productsService.getCategories().catch(() => []),
            this.productsService.getVehicleMakes().catch(() => []),
        ]);
        const urls = [];
        const url = (loc, priority, freq, lastmod = today) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
        urls.push(url(`${SITE_URL}/`, '1.0', 'daily'));
        urls.push(url(`${SITE_URL}/offers`, '0.9', 'daily'));
        urls.push(url(`${SITE_URL}/featured`, '0.9', 'daily'));
        urls.push(url(`${SITE_URL}/catalog`, '0.8', 'daily'));
        urls.push(url(`${SITE_URL}/brands`, '0.8', 'weekly'));
        urls.push(url(`${SITE_URL}/makes`, '0.8', 'weekly'));
        urls.push(url(`${SITE_URL}/contact`, '0.6', 'monthly'));
        for (const cat of categories) {
            if (cat.name && cat.isActive !== false) {
                urls.push(url(`${SITE_URL}/category/${encodeURIComponent(cat.name.toLowerCase())}`, '0.9', 'daily'));
            }
        }
        for (const make of makes) {
            urls.push(url(`${SITE_URL}/make/${make.id}`, '0.8', 'weekly'));
        }
        const brands = new Set();
        for (const p of products) {
            if (p.brand)
                brands.add(p.brand);
        }
        for (const brand of brands) {
            urls.push(url(`${SITE_URL}/brands/${encodeURIComponent(brand)}`, '0.8', 'weekly'));
        }
        for (const product of products) {
            if (product.isActive !== false) {
                const slug = `${product.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${product.id}`;
                const lastmod = product.updatedAt
                    ? new Date(product.updatedAt).toISOString().split('T')[0]
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
};
exports.SitemapController = SitemapController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Header)('Content-Type', 'application/xml; charset=utf-8'),
    (0, common_1.Header)('Cache-Control', 'public, max-age=3600, s-maxage=3600'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SitemapController.prototype, "getSitemap", null);
exports.SitemapController = SitemapController = __decorate([
    (0, common_1.Controller)('api/sitemap.xml'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], SitemapController);
//# sourceMappingURL=sitemap.controller.js.map