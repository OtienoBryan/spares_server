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
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
let CloudinaryService = class CloudinaryService {
    configService;
    constructor(configService) {
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }
    async uploadImage(file, folder = 'drinks-products', publicId) {
        return new Promise((resolve, reject) => {
            const uploadOptions = {
                folder,
                resource_type: 'auto',
                quality: 'auto',
                fetch_format: 'auto',
            };
            if (publicId) {
                uploadOptions.public_id = publicId;
            }
            cloudinary_1.v2.uploader.upload_stream(uploadOptions, (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(new Error('Failed to upload image to Cloudinary'));
                }
                else if (result) {
                    resolve({
                        public_id: result.public_id,
                        secure_url: result.secure_url,
                        width: result.width,
                        height: result.height,
                        format: result.format,
                        bytes: result.bytes,
                    });
                }
                else {
                    reject(new Error('Upload completed but no result received'));
                }
            }).end(file.buffer);
        });
    }
    async uploadMultipleImages(files, folder = 'drinks-products') {
        const uploadPromises = files.map(file => this.uploadImage(file, folder));
        return Promise.all(uploadPromises);
    }
    async deleteImage(publicId) {
        try {
            const result = await cloudinary_1.v2.uploader.destroy(publicId);
            return result.result === 'ok';
        }
        catch (error) {
            console.error('Cloudinary delete error:', error);
            return false;
        }
    }
    async deleteMultipleImages(publicIds) {
        try {
            const result = await cloudinary_1.v2.api.delete_resources(publicIds);
            return result.deleted && Object.keys(result.deleted).length > 0;
        }
        catch (error) {
            console.error('Cloudinary delete multiple error:', error);
            return false;
        }
    }
    getOptimizedImageUrl(publicId, width, height, quality = 'auto') {
        const transformations = {
            quality,
            fetch_format: 'auto',
        };
        if (width)
            transformations.width = width;
        if (height)
            transformations.height = height;
        return cloudinary_1.v2.url(publicId, transformations);
    }
    getImageUrl(publicId, transformations = {}) {
        return cloudinary_1.v2.url(publicId, transformations);
    }
    isConfigured() {
        const cloudName = this.configService.get('CLOUDINARY_CLOUD_NAME');
        const apiKey = this.configService.get('CLOUDINARY_API_KEY');
        const apiSecret = this.configService.get('CLOUDINARY_API_SECRET');
        return !!(cloudName && apiKey && apiSecret &&
            cloudName !== 'your-cloud-name' &&
            apiKey !== 'your-api-key' &&
            apiSecret !== 'your-api-secret');
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map