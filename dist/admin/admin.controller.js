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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getDashboardStats() {
        return this.adminService.getDashboardStats();
    }
    async getAllProducts() {
        return this.adminService.getAllProducts();
    }
    async getProductById(id) {
        return this.adminService.getProductById(id);
    }
    async createProduct(productData) {
        return this.adminService.createProduct(productData);
    }
    async updateProduct(id, productData) {
        console.log('🚀 [AdminController] PUT /api/admin/products/:id called');
        console.log('  ID:', id);
        console.log('  Request Body:', JSON.stringify(productData, null, 2));
        console.log('  Brand ID in request:', productData.brandId);
        console.log('  Brand ID type:', typeof productData.brandId);
        console.log('  Brand name in request:', productData.brand);
        console.log('  Brand name type:', typeof productData.brand);
        console.log('  Subcategory ID in request:', productData.subcategoryId);
        console.log('  Subcategory ID type:', typeof productData.subcategoryId);
        console.log('  Headers:', JSON.stringify(this.getRequestHeaders(), null, 2));
        try {
            const result = await this.adminService.updateProduct(id, productData);
            console.log('✅ [AdminController] Product updated successfully');
            console.log('  Response brandId:', result?.brandId);
            console.log('  Response brand:', result?.brand);
            console.log('  Response subcategoryId:', result?.subcategoryId);
            console.log('  Response subcategory:', result?.subcategory);
            return result;
        }
        catch (error) {
            console.error('❌ [AdminController] Error updating product:', error);
            console.error('  Error message:', error.message);
            console.error('  Error stack:', error.stack);
            throw error;
        }
    }
    getRequestHeaders() {
        return { 'content-type': 'application/json' };
    }
    async deleteProduct(id) {
        return this.adminService.deleteProduct(id);
    }
    async getAllCategories() {
        return this.adminService.getAllCategories();
    }
    async getCategoryById(id) {
        return this.adminService.getCategoryById(id);
    }
    async createCategory(categoryData) {
        return this.adminService.createCategory(categoryData);
    }
    async updateCategory(id, categoryData) {
        return this.adminService.updateCategory(id, categoryData);
    }
    async deleteCategory(id) {
        return this.adminService.deleteCategory(id);
    }
    async getAllOrders() {
        return this.adminService.getAllOrders();
    }
    async getOrderById(id) {
        return this.adminService.getOrderById(id);
    }
    async updateOrderStatus(id, statusData) {
        return this.adminService.updateOrderStatus(id, statusData);
    }
    async deleteOrder(id) {
        return this.adminService.deleteOrder(id);
    }
    async getAllUsers() {
        return this.adminService.getAllUsers();
    }
    async getUserById(id) {
        return this.adminService.getUserById(id);
    }
    async updateUser(id, userData) {
        return this.adminService.updateUser(id, userData);
    }
    async toggleUserStatus(id) {
        return this.adminService.toggleUserStatus(id);
    }
    async deleteUser(id) {
        return this.adminService.deleteUser(id);
    }
    async getAllStaff() {
        return this.adminService.getAllStaff();
    }
    async getStaffById(id) {
        return this.adminService.getStaffById(id);
    }
    async createStaff(staffData) {
        return this.adminService.createStaff(staffData);
    }
    async updateStaff(id, staffData) {
        return this.adminService.updateStaff(id, staffData);
    }
    async toggleStaffStatus(id) {
        return this.adminService.toggleStaffStatus(id);
    }
    async deleteStaff(id) {
        return this.adminService.deleteStaff(id);
    }
    async getAllBlogs() {
        return this.adminService.getAllBlogs();
    }
    async getBlogById(id) {
        return this.adminService.getBlogById(id);
    }
    async createBlog(blogData) {
        console.log('🚀 [AdminController] POST /api/admin/blogs called');
        console.log('  Blog Data:', JSON.stringify(blogData, null, 2));
        try {
            const result = await this.adminService.createBlog(blogData);
            console.log('✅ [AdminController] Blog created successfully');
            return result;
        }
        catch (error) {
            console.error('❌ [AdminController] Error creating blog:', error);
            throw error;
        }
    }
    async updateBlog(id, blogData) {
        return this.adminService.updateBlog(id, blogData);
    }
    async deleteBlog(id) {
        return this.adminService.deleteBlog(id);
    }
    async getAllVehicleModels() {
        return this.adminService.getAllVehicleModels();
    }
    async createVehicleModel(data) {
        return this.adminService.createVehicleModel(data);
    }
    async updateVehicleModel(id, data) {
        return this.adminService.updateVehicleModel(id, data);
    }
    async deleteVehicleModel(id) {
        return this.adminService.deleteVehicleModel(id);
    }
    async getAllVehicleMakes() {
        return this.adminService.getAllVehicleMakes();
    }
    async createVehicleMake(data) {
        return this.adminService.createVehicleMake(data);
    }
    async updateVehicleMake(id, data) {
        return this.adminService.updateVehicleMake(id, data);
    }
    async deleteVehicleMake(id) {
        return this.adminService.deleteVehicleMake(id);
    }
    async getAllVehicleYears() {
        return this.adminService.getAllVehicleYears();
    }
    async createVehicleYear(data) {
        return this.adminService.createVehicleYear(data);
    }
    async updateVehicleYear(id, data) {
        return this.adminService.updateVehicleYear(id, data);
    }
    async deleteVehicleYear(id) {
        return this.adminService.deleteVehicleYear(id);
    }
    async getProductImages(id) {
        return this.adminService.getProductImages(id);
    }
    async addProductImage(id, data) {
        return this.adminService.addProductImage(id, data);
    }
    async deleteProductImage(imageId) {
        return this.adminService.deleteProductImage(imageId);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllProducts", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Post)('products'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Put)('products/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)('products/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.Get)('categories/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCategoryById", null);
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Put)('categories/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('orders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Put)('orders/:id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Delete)('orders/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteOrder", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Put)('users/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Put)('users/:id/toggle-status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "toggleUserStatus", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('staff'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllStaff", null);
__decorate([
    (0, common_1.Get)('staff/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStaffById", null);
__decorate([
    (0, common_1.Post)('staff'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createStaff", null);
__decorate([
    (0, common_1.Put)('staff/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateStaff", null);
__decorate([
    (0, common_1.Put)('staff/:id/toggle-status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "toggleStaffStatus", null);
__decorate([
    (0, common_1.Delete)('staff/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteStaff", null);
__decorate([
    (0, common_1.Get)('blogs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllBlogs", null);
__decorate([
    (0, common_1.Get)('blogs/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getBlogById", null);
__decorate([
    (0, common_1.Post)('blogs'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createBlog", null);
__decorate([
    (0, common_1.Put)('blogs/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateBlog", null);
__decorate([
    (0, common_1.Delete)('blogs/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteBlog", null);
__decorate([
    (0, common_1.Get)('vehicle-models'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllVehicleModels", null);
__decorate([
    (0, common_1.Post)('vehicle-models'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createVehicleModel", null);
__decorate([
    (0, common_1.Put)('vehicle-models/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateVehicleModel", null);
__decorate([
    (0, common_1.Delete)('vehicle-models/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteVehicleModel", null);
__decorate([
    (0, common_1.Get)('vehicle-makes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllVehicleMakes", null);
__decorate([
    (0, common_1.Post)('vehicle-makes'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createVehicleMake", null);
__decorate([
    (0, common_1.Put)('vehicle-makes/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateVehicleMake", null);
__decorate([
    (0, common_1.Delete)('vehicle-makes/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteVehicleMake", null);
__decorate([
    (0, common_1.Get)('vehicle-years'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllVehicleYears", null);
__decorate([
    (0, common_1.Post)('vehicle-years'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createVehicleYear", null);
__decorate([
    (0, common_1.Put)('vehicle-years/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateVehicleYear", null);
__decorate([
    (0, common_1.Delete)('vehicle-years/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteVehicleYear", null);
__decorate([
    (0, common_1.Get)('products/:id/images'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getProductImages", null);
__decorate([
    (0, common_1.Post)('products/:id/images'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addProductImage", null);
__decorate([
    (0, common_1.Delete)('product-images/:imageId'),
    __param(0, (0, common_1.Param)('imageId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteProductImage", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('api/admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map