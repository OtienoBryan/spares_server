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
exports.CloudinaryController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_service_1 = require("./cloudinary.service");
let CloudinaryController = class CloudinaryController {
    cloudinaryService;
    constructor(cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }
    getConfig() {
        return {
            configured: this.cloudinaryService.isConfigured(),
            message: this.cloudinaryService.isConfigured()
                ? 'Cloudinary is properly configured'
                : 'Cloudinary is not configured. Please set up your environment variables.'
        };
    }
    async uploadImage(file, folder, publicId) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (!this.cloudinaryService.isConfigured()) {
            throw new common_1.BadRequestException('Cloudinary is not configured. Please set up your environment variables.');
        }
        try {
            const result = await this.cloudinaryService.uploadImage(file, folder || 'drinks-products', publicId);
            return {
                success: true,
                data: result,
                message: 'Image uploaded successfully'
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Upload failed: ${error.message}`);
        }
    }
    async uploadMultipleImages(files, folder) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        if (!this.cloudinaryService.isConfigured()) {
            throw new common_1.BadRequestException('Cloudinary is not configured. Please set up your environment variables.');
        }
        try {
            const results = await this.cloudinaryService.uploadMultipleImages(files, folder || 'drinks-products');
            return {
                success: true,
                data: results,
                message: `${results.length} images uploaded successfully`
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Upload failed: ${error.message}`);
        }
    }
    async deleteImage(publicId) {
        if (!this.cloudinaryService.isConfigured()) {
            throw new common_1.BadRequestException('Cloudinary is not configured. Please set up your environment variables.');
        }
        try {
            const success = await this.cloudinaryService.deleteImage(publicId);
            if (!success) {
                throw new common_1.NotFoundException('Image not found or could not be deleted');
            }
            return {
                success: true,
                message: 'Image deleted successfully'
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Delete failed: ${error.message}`);
        }
    }
    async deleteMultipleImages(publicIds) {
        if (!publicIds || publicIds.length === 0) {
            throw new common_1.BadRequestException('No public IDs provided');
        }
        if (!this.cloudinaryService.isConfigured()) {
            throw new common_1.BadRequestException('Cloudinary is not configured. Please set up your environment variables.');
        }
        try {
            const success = await this.cloudinaryService.deleteMultipleImages(publicIds);
            if (!success) {
                throw new common_1.BadRequestException('Failed to delete one or more images');
            }
            return {
                success: true,
                message: `${publicIds.length} images deleted successfully`
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Delete failed: ${error.message}`);
        }
    }
    getImageUrl(publicId, width, height, quality) {
        if (!this.cloudinaryService.isConfigured()) {
            throw new common_1.BadRequestException('Cloudinary is not configured. Please set up your environment variables.');
        }
        const transformations = {};
        if (width)
            transformations.width = parseInt(width);
        if (height)
            transformations.height = parseInt(height);
        if (quality)
            transformations.quality = quality;
        const url = this.cloudinaryService.getImageUrl(publicId, transformations);
        return {
            success: true,
            data: { url },
            message: 'Image URL generated successfully'
        };
    }
    getOptimizedImageUrl(publicId, width, height, quality) {
        if (!this.cloudinaryService.isConfigured()) {
            throw new common_1.BadRequestException('Cloudinary is not configured. Please set up your environment variables.');
        }
        const url = this.cloudinaryService.getOptimizedImageUrl(publicId, width ? parseInt(width) : undefined, height ? parseInt(height) : undefined, quality || 'auto');
        return {
            success: true,
            data: { url },
            message: 'Optimized image URL generated successfully'
        };
    }
};
exports.CloudinaryController = CloudinaryController;
__decorate([
    (0, common_1.Get)('config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CloudinaryController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('folder')),
    __param(2, (0, common_1.Body)('publicId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], CloudinaryController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)('upload-multiple'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10)),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", Promise)
], CloudinaryController.prototype, "uploadMultipleImages", null);
__decorate([
    (0, common_1.Delete)('delete/:publicId'),
    __param(0, (0, common_1.Param)('publicId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CloudinaryController.prototype, "deleteImage", null);
__decorate([
    (0, common_1.Post)('delete-multiple'),
    __param(0, (0, common_1.Body)('publicIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], CloudinaryController.prototype, "deleteMultipleImages", null);
__decorate([
    (0, common_1.Get)('url/:publicId'),
    __param(0, (0, common_1.Param)('publicId')),
    __param(1, (0, common_1.Query)('width')),
    __param(2, (0, common_1.Query)('height')),
    __param(3, (0, common_1.Query)('quality')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], CloudinaryController.prototype, "getImageUrl", null);
__decorate([
    (0, common_1.Get)('optimized-url/:publicId'),
    __param(0, (0, common_1.Param)('publicId')),
    __param(1, (0, common_1.Query)('width')),
    __param(2, (0, common_1.Query)('height')),
    __param(3, (0, common_1.Query)('quality')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], CloudinaryController.prototype, "getOptimizedImageUrl", null);
exports.CloudinaryController = CloudinaryController = __decorate([
    (0, common_1.Controller)('cloudinary'),
    __metadata("design:paramtypes", [cloudinary_service_1.CloudinaryService])
], CloudinaryController);
//# sourceMappingURL=cloudinary.controller.js.map