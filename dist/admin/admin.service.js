"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const product_entity_1 = require("../entities/product.entity");
const category_entity_1 = require("../entities/category.entity");
const order_entity_1 = require("../entities/order.entity");
const user_entity_1 = require("../entities/user.entity");
const brand_entity_1 = require("../entities/brand.entity");
const subcategory_entity_1 = require("../entities/subcategory.entity");
const staff_entity_1 = require("../entities/staff.entity");
const blog_entity_1 = require("../entities/blog.entity");
const vehicle_model_entity_1 = require("../entities/vehicle-model.entity");
let AdminService = class AdminService {
    productRepository;
    categoryRepository;
    orderRepository;
    userRepository;
    brandRepository;
    subCategoryRepository;
    staffRepository;
    blogRepository;
    vehicleModelRepository;
    constructor(productRepository, categoryRepository, orderRepository, userRepository, brandRepository, subCategoryRepository, staffRepository, blogRepository, vehicleModelRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.brandRepository = brandRepository;
        this.subCategoryRepository = subCategoryRepository;
        this.staffRepository = staffRepository;
        this.blogRepository = blogRepository;
        this.vehicleModelRepository = vehicleModelRepository;
    }
    async getDashboardStats() {
        const [totalProducts, totalCategories, totalOrders, totalUsers, recentOrders] = await Promise.all([
            this.productRepository.count({ where: { isActive: true } }),
            this.categoryRepository.count({ where: { isActive: true } }),
            this.orderRepository.count(),
            this.userRepository.count(),
            this.orderRepository.find({
                relations: ['user', 'items', 'items.product'],
                order: { createdAt: 'DESC' },
                take: 5,
            }),
        ]);
        const topProducts = await this.productRepository.find({
            where: { isFeatured: true, isActive: true },
            relations: ['category'],
            take: 5,
        });
        return {
            totalProducts,
            totalCategories,
            totalOrders,
            totalUsers,
            recentOrders: recentOrders.map(order => ({
                id: order.id,
                orderNumber: order.orderNumber,
                user: order.user,
                total: order.total,
                status: order.status,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            })),
            topProducts,
        };
    }
    async getAllProducts() {
        const products = await this.productRepository.find({
            relations: ['category', 'brandEntity', 'subcategory', 'vehicleModel', 'vehicleModels'],
            order: { createdAt: 'DESC' },
        });
        console.log('[getAllProducts] Total products:', products.length);
        const onOfferCount = products.filter(p => p.isOnOffer).length;
        console.log('[getAllProducts] Products with isOnOffer=true:', onOfferCount);
        if (onOfferCount > 0) {
            const sample = products.find(p => p.isOnOffer);
            if (sample) {
                console.log('[getAllProducts] Sample on-offer product:', {
                    id: sample.id,
                    name: sample.name,
                    isOnOffer: sample.isOnOffer,
                    isOnOfferType: typeof sample.isOnOffer,
                    rawProduct: JSON.stringify(sample, null, 2).substring(0, 500),
                });
            }
            else {
                console.warn('[getAllProducts] onOfferCount > 0 but no sample found');
            }
        }
        return products.map(product => {
            const isOnOfferValue = product.isOnOffer !== undefined ? product.isOnOffer : false;
            if (product.id && product.isOnOffer === undefined) {
                console.warn(`[getAllProducts] Product ${product.id} (${product.name}) has undefined isOnOffer`);
            }
            return {
                ...product,
                brandId: product.brandId || null,
                brand: product.brand || (product.brandEntity ? product.brandEntity.name : ''),
                brandEntity: undefined,
                isActive: !!product.isActive,
                isFeatured: !!product.isFeatured,
                isOnOffer: !!isOnOfferValue,
                isPopularWine: !!product.isPopularWine,
                requiresAgeVerification: !!product.requiresAgeVerification,
            };
        });
    }
    async getProductById(id) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['category', 'brandEntity', 'subcategory', 'vehicleModel', 'vehicleModels'],
        });
        if (!product)
            return null;
        console.log('[getProductById] Product loaded:', {
            id: product.id,
            name: product.name,
            isOnOffer: product.isOnOffer,
            isOnOfferType: typeof product.isOnOffer,
            hasIsOnOffer: 'isOnOffer' in product,
            allKeys: Object.keys(product).filter(k => k.includes('Offer') || k.includes('offer'))
        });
        const isOnOfferValue = product.isOnOffer !== undefined ? product.isOnOffer : false;
        if (product.isOnOffer === undefined) {
            console.warn(`[getProductById] Product ${id} has undefined isOnOffer - checking database directly...`);
            const rawResult = await this.productRepository.query('SELECT id, name, isOnOffer FROM products WHERE id = ?', [id]);
            console.log('[getProductById] Raw SQL result:', rawResult);
            if (rawResult && rawResult[0]) {
                const rawIsOnOffer = rawResult[0].isOnOffer;
                console.log('[getProductById] Raw isOnOffer from DB:', rawIsOnOffer, 'type:', typeof rawIsOnOffer);
            }
        }
        return {
            ...product,
            brandId: product.brandId || null,
            brand: product.brand || (product.brandEntity ? product.brandEntity.name : ''),
            brandEntity: undefined,
            isActive: !!product.isActive,
            isFeatured: !!product.isFeatured,
            isOnOffer: !!isOnOfferValue,
            isPopularWine: !!product.isPopularWine,
            requiresAgeVerification: !!product.requiresAgeVerification,
        };
    }
    async createProduct(productData) {
        console.log('  Processing brandId for product creation...');
        console.log('    productData.brandId:', productData.brandId, '(type:', typeof productData.brandId, ')');
        if (productData.brandId !== undefined && productData.brandId !== null && productData.brandId !== '') {
            const brandId = typeof productData.brandId === 'string' ? parseInt(productData.brandId) : productData.brandId;
            console.log('    Parsed brandId:', brandId, '(type:', typeof brandId, ')');
            if (brandId && !isNaN(brandId)) {
                const brand = await this.brandRepository.findOne({ where: { id: brandId } });
                console.log('    Found brand in database:', brand);
                if (brand) {
                    productData.brand = brand.name;
                    productData.brandId = brandId;
                    console.log('  ✅ Set brand name from brandId:', brand.name);
                }
                else {
                    console.log('  ⚠️ Warning: Brand not found for brandId:', brandId);
                    productData.brand = '';
                    productData.brandId = null;
                }
            }
            else {
                productData.brand = '';
                productData.brandId = null;
                console.log('  🗑️ Cleared brand name as brandId is empty or invalid');
            }
        }
        else {
            console.log('  ℹ️ No brandId provided for product creation');
        }
        if (productData.subcategoryId !== undefined && productData.subcategoryId !== null) {
            const subcategoryId = parseInt(productData.subcategoryId);
            if (subcategoryId && !isNaN(subcategoryId)) {
                productData.subcategoryId = subcategoryId;
                console.log('  Set subcategoryId:', subcategoryId);
            }
            else {
                productData.subcategoryId = null;
                console.log('  Cleared subcategoryId as it is empty or invalid');
            }
        }
        else {
            productData.subcategoryId = null;
        }
        const vehicleModelIds = this.resolveVehicleModelIdsForCreate(productData);
        delete productData.vehicleModelIds;
        delete productData.vehicleModels;
        productData.vehicleModelId = vehicleModelIds[0] ?? null;
        const product = this.productRepository.create(productData);
        const saveResult = await this.productRepository.save(product);
        const saved = Array.isArray(saveResult) ? saveResult[0] : saveResult;
        await this.applyVehicleModelsToProduct(saved, vehicleModelIds);
        return this.getProductById(saved.id);
    }
    async updateProduct(id, productData) {
        const resolvedVehicleIds = this.resolveVehicleModelIdsForUpdate(productData);
        delete productData.vehicleModelIds;
        delete productData.vehicleModels;
        if (resolvedVehicleIds !== undefined) {
            delete productData.vehicleModelId;
        }
        console.log('🔧 [AdminService] updateProduct called with:');
        console.log('  ID:', id);
        console.log('  Product Data:', JSON.stringify(productData, null, 2));
        console.log('  Subcategory ID in request:', productData.subcategoryId);
        console.log('  Subcategory ID type:', typeof productData.subcategoryId);
        console.log('  Brand ID in request:', productData.brandId);
        console.log('  Brand ID type:', typeof productData.brandId);
        const currentProduct = await this.productRepository.findOne({
            where: { id },
            relations: ['subcategory', 'brandEntity', 'category']
        });
        console.log('  Current Product before update:');
        console.log('    Current subcategoryId:', currentProduct?.subcategoryId);
        console.log('    Current subcategory:', currentProduct?.subcategory);
        console.log('    Current brandId:', currentProduct?.brandId);
        console.log('    Current brandEntity:', currentProduct?.brandEntity);
        console.log('  Processing brandId update...');
        console.log('    productData.brandId:', productData.brandId, '(type:', typeof productData.brandId, ')');
        console.log('    productData.brand:', productData.brand, '(type:', typeof productData.brand, ')');
        if (productData.brandId !== undefined && productData.brandId !== null && productData.brandId !== '' && productData.brandId !== 0) {
            const brandId = typeof productData.brandId === 'string' ? parseInt(productData.brandId) : productData.brandId;
            console.log('    Parsed brandId:', brandId, '(type:', typeof brandId, ')');
            if (brandId && !isNaN(brandId) && brandId > 0) {
                const brand = await this.brandRepository.findOne({ where: { id: brandId } });
                console.log('    Found brand in database:', brand);
                if (brand) {
                    productData.brand = brand.name;
                    productData.brandId = brandId;
                    console.log('  ✅ Updated brand name from brandId:', brand.name);
                }
                else {
                    console.log('  ⚠️ Warning: Brand not found for brandId:', brandId);
                    console.log('  ℹ️ Keeping existing brand data due to lookup failure');
                }
            }
            else {
                productData.brand = '';
                productData.brandId = null;
                console.log('  🗑️ Cleared brand name as brandId is invalid');
            }
        }
        else if (productData.brandId === null || productData.brandId === '') {
            productData.brand = '';
            productData.brandId = null;
            console.log('  🗑️ Explicitly cleared brand data');
        }
        else {
            console.log('  ℹ️ No brandId provided in request data - keeping existing brand');
            delete productData.brandId;
            delete productData.brand;
        }
        console.log('  Processing subcategoryId...');
        if (productData.subcategoryId !== undefined && productData.subcategoryId !== null) {
            const subcategoryId = parseInt(productData.subcategoryId);
            console.log('    Parsed subcategoryId:', subcategoryId);
            if (subcategoryId && !isNaN(subcategoryId)) {
                const subcategory = await this.subCategoryRepository.findOne({ where: { id: subcategoryId } });
                if (subcategory) {
                    productData.subcategoryId = subcategoryId;
                    console.log('  ✅ Updated subcategoryId:', subcategoryId, 'for subcategory:', subcategory.name);
                }
                else {
                    console.log('  ⚠️ Warning: Subcategory not found for subcategoryId:', subcategoryId);
                    productData.subcategoryId = null;
                }
            }
            else {
                productData.subcategoryId = null;
                console.log('  Cleared subcategoryId as it is empty or invalid');
            }
        }
        else {
            console.log('  No subcategoryId in request data');
        }
        console.log('  Final productData before database update:');
        console.log('    brandId:', productData.brandId);
        console.log('    brand:', productData.brand);
        console.log('    subcategoryId:', productData.subcategoryId);
        console.log('    vehicleModelId:', productData.vehicleModelId, 'resolvedVehicleIds:', resolvedVehicleIds);
        console.log('    skus:', productData.skus);
        console.log('    Full data:', JSON.stringify(productData, null, 2));
        const existingProduct = await this.productRepository.findOne({
            where: { id },
            relations: ['category', 'brandEntity', 'subcategory', 'vehicleModels'],
        });
        if (!existingProduct) {
            throw new Error(`Product with ID ${id} not found`);
        }
        console.log('  Existing product before merge:', JSON.stringify(existingProduct, null, 2));
        const mergedProduct = { ...existingProduct, ...productData };
        if (productData.skus !== undefined) {
            mergedProduct.skus = productData.skus;
            console.log('  ✅ Explicitly set SKUs:', JSON.stringify(mergedProduct.skus, null, 2));
        }
        console.log('  Merged product data:', JSON.stringify(mergedProduct, null, 2));
        if (productData.brandId !== undefined) {
            mergedProduct.brandId = productData.brandId;
        }
        if (productData.brand !== undefined) {
            mergedProduct.brand = productData.brand;
        }
        if (productData.isOnOffer !== undefined) {
            mergedProduct.isOnOffer = !!productData.isOnOffer;
            console.log('  ✅ Explicitly set isOnOffer:', mergedProduct.isOnOffer);
        }
        if (productData.isFeatured !== undefined) {
            mergedProduct.isFeatured = !!productData.isFeatured;
        }
        if (productData.isPopularWine !== undefined) {
            mergedProduct.isPopularWine = !!productData.isPopularWine;
        }
        if (productData.isActive !== undefined) {
            mergedProduct.isActive = !!productData.isActive;
        }
        if (productData.requiresAgeVerification !== undefined) {
            mergedProduct.requiresAgeVerification = !!productData.requiresAgeVerification;
        }
        if (resolvedVehicleIds !== undefined) {
            await this.applyVehicleModelsToProduct(mergedProduct, resolvedVehicleIds);
        }
        console.log('  Final merged product before save:', {
            id: mergedProduct.id,
            brand: mergedProduct.brand,
            brandId: mergedProduct.brandId,
            subcategoryId: mergedProduct.subcategoryId,
            isOnOffer: mergedProduct.isOnOffer,
            isFeatured: mergedProduct.isFeatured,
            isActive: mergedProduct.isActive
        });
        try {
            const savedProduct = await this.productRepository.save(mergedProduct);
            console.log('  ✅ Database save result:', {
                id: savedProduct.id,
                name: savedProduct.name,
                isOnOffer: savedProduct.isOnOffer,
                isOnOfferType: typeof savedProduct.isOnOffer,
            });
            const rawVerify = await this.productRepository.query('SELECT id, name, isOnOffer FROM products WHERE id = ?', [id]);
            console.log('  🔍 Raw SQL verification after save:', rawVerify);
        }
        catch (saveError) {
            console.error('  ❌ Database save error:', saveError);
            throw saveError;
        }
        const updatedProduct = await this.getProductById(id);
        console.log('  Updated Product after database query:');
        console.log('    brandId:', updatedProduct?.brandId);
        console.log('    brand:', updatedProduct?.brand);
        console.log('    subcategoryId:', updatedProduct?.subcategoryId);
        console.log('    subcategory:', updatedProduct?.subcategory);
        console.log('    isOnOffer:', updatedProduct?.isOnOffer, '(type:', typeof updatedProduct?.isOnOffer, ')');
        console.log('    isFeatured:', updatedProduct?.isFeatured);
        console.log('    isActive:', updatedProduct?.isActive);
        console.log('    Full updated product:', JSON.stringify(updatedProduct, null, 2));
        return updatedProduct;
    }
    async deleteProduct(id) {
        return this.productRepository.delete(id);
    }
    async getAllCategories() {
        return this.categoryRepository.find({
            order: { name: 'ASC' },
        });
    }
    async getCategoryById(id) {
        return this.categoryRepository.findOne({
            where: { id },
        });
    }
    async createCategory(categoryData) {
        const category = this.categoryRepository.create(categoryData);
        return this.categoryRepository.save(category);
    }
    async updateCategory(id, categoryData) {
        await this.categoryRepository.update(id, categoryData);
        return this.getCategoryById(id);
    }
    async deleteCategory(id) {
        return this.categoryRepository.delete(id);
    }
    async getAllOrders() {
        return this.orderRepository.find({
            relations: ['user', 'items', 'items.product'],
            order: { createdAt: 'DESC' },
        });
    }
    async getOrderById(id) {
        return this.orderRepository.findOne({
            where: { id },
            relations: ['user', 'items', 'items.product'],
        });
    }
    async updateOrderStatus(id, statusData) {
        await this.orderRepository.update(id, statusData);
        return this.getOrderById(id);
    }
    async deleteOrder(id) {
        return this.orderRepository.delete(id);
    }
    async getAllUsers() {
        return this.userRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async getUserById(id) {
        return this.userRepository.findOne({
            where: { id },
        });
    }
    async updateUser(id, userData) {
        await this.userRepository.update(id, userData);
        return this.getUserById(id);
    }
    async toggleUserStatus(id) {
        const user = await this.getUserById(id);
        if (user) {
            user.isActive = !user.isActive;
            return this.userRepository.save(user);
        }
        return null;
    }
    async deleteUser(id) {
        return this.userRepository.delete(id);
    }
    async getAllStaff() {
        return this.staffRepository.find({
            order: { createdAt: 'DESC' },
            select: ['id', 'email', 'firstName', 'lastName', 'phone', 'role', 'isActive', 'lastLogin', 'createdAt', 'updatedAt'],
        });
    }
    async getStaffById(id) {
        return this.staffRepository.findOne({
            where: { id },
            select: ['id', 'email', 'firstName', 'lastName', 'phone', 'role', 'isActive', 'lastLogin', 'createdAt', 'updatedAt'],
        });
    }
    async createStaff(staffData) {
        if (staffData.password) {
            staffData.password = await bcrypt.hash(staffData.password, 10);
        }
        const staff = this.staffRepository.create(staffData);
        await this.staffRepository.save(staff);
        const { password, ...result } = staff;
        return result;
    }
    async updateStaff(id, staffData) {
        if (staffData.password) {
            staffData.password = await bcrypt.hash(staffData.password, 10);
        }
        await this.staffRepository.update(id, staffData);
        return this.getStaffById(id);
    }
    async toggleStaffStatus(id) {
        const staff = await this.getStaffById(id);
        if (staff) {
            await this.staffRepository.update(id, { isActive: !staff.isActive });
            return this.getStaffById(id);
        }
        return null;
    }
    async deleteStaff(id) {
        return this.staffRepository.delete(id);
    }
    async getAllBlogs() {
        return this.blogRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async getBlogById(id) {
        return this.blogRepository.findOne({
            where: { id },
        });
    }
    async createBlog(blogData) {
        if (!blogData.slug && blogData.title) {
            blogData.slug = blogData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }
        const blog = this.blogRepository.create(blogData);
        return this.blogRepository.save(blog);
    }
    async updateBlog(id, blogData) {
        if (blogData.title && !blogData.slug) {
            blogData.slug = blogData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }
        await this.blogRepository.update(id, blogData);
        return this.getBlogById(id);
    }
    async deleteBlog(id) {
        return this.blogRepository.delete(id);
    }
    normalizeVehicleModelIdArray(value) {
        if (!Array.isArray(value))
            return [];
        const nums = value
            .map((v) => parseInt(String(v), 10))
            .filter((n) => !Number.isNaN(n) && n > 0);
        return [...new Set(nums)];
    }
    resolveVehicleModelIdsForCreate(productData) {
        if (Object.prototype.hasOwnProperty.call(productData, 'vehicleModelIds')) {
            return this.normalizeVehicleModelIdArray(productData.vehicleModelIds);
        }
        const v = productData.vehicleModelId;
        if (v === undefined || v === null || v === '')
            return [];
        const n = typeof v === 'string' ? parseInt(v, 10) : Number(v);
        return !Number.isNaN(n) && n > 0 ? [n] : [];
    }
    resolveVehicleModelIdsForUpdate(productData) {
        if (Object.prototype.hasOwnProperty.call(productData, 'vehicleModelIds')) {
            return this.normalizeVehicleModelIdArray(productData.vehicleModelIds);
        }
        if (Object.prototype.hasOwnProperty.call(productData, 'vehicleModelId')) {
            const v = productData.vehicleModelId;
            if (v === null || v === '')
                return [];
            const n = typeof v === 'string' ? parseInt(v, 10) : Number(v);
            return !Number.isNaN(n) && n > 0 ? [n] : [];
        }
        return undefined;
    }
    async applyVehicleModelsToProduct(product, orderedIds) {
        if (orderedIds.length === 0) {
            product.vehicleModels = [];
            product.vehicleModelId = null;
            return;
        }
        const models = await this.vehicleModelRepository.findBy({ id: (0, typeorm_2.In)(orderedIds) });
        const orderMap = new Map(orderedIds.map((mid, i) => [mid, i]));
        models.sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
        product.vehicleModels = models;
        product.vehicleModelId = models[0]?.id;
    }
    async getAllVehicleModels() {
        return this.vehicleModelRepository.find({ order: { name: 'ASC' } });
    }
    async createVehicleModel(data) {
        const model = this.vehicleModelRepository.create({ name: data?.name?.trim() });
        return this.vehicleModelRepository.save(model);
    }
    async updateVehicleModel(id, data) {
        const payload = {};
        if (typeof data?.name === 'string')
            payload.name = data.name.trim();
        await this.vehicleModelRepository.update(id, payload);
        return this.vehicleModelRepository.findOne({ where: { id } });
    }
    async deleteVehicleModel(id) {
        return this.vehicleModelRepository.delete(id);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(brand_entity_1.Brand)),
    __param(5, (0, typeorm_1.InjectRepository)(subcategory_entity_1.SubCategory)),
    __param(6, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __param(7, (0, typeorm_1.InjectRepository)(blog_entity_1.Blog)),
    __param(8, (0, typeorm_1.InjectRepository)(vehicle_model_entity_1.VehicleModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map