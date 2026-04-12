import { CloudinaryService } from './cloudinary.service';
export declare class CloudinaryController {
    private readonly cloudinaryService;
    constructor(cloudinaryService: CloudinaryService);
    getConfig(): {
        configured: boolean;
        message: string;
    };
    uploadImage(file: Express.Multer.File, folder?: string, publicId?: string): Promise<{
        success: boolean;
        data: {
            public_id: string;
            secure_url: string;
            width: number;
            height: number;
            format: string;
            bytes: number;
        };
        message: string;
    }>;
    uploadMultipleImages(files: Express.Multer.File[], folder?: string): Promise<{
        success: boolean;
        data: {
            public_id: string;
            secure_url: string;
            width: number;
            height: number;
            format: string;
            bytes: number;
        }[];
        message: string;
    }>;
    deleteImage(publicId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteMultipleImages(publicIds: string[]): Promise<{
        success: boolean;
        message: string;
    }>;
    getImageUrl(publicId: string, width?: string, height?: string, quality?: string): {
        success: boolean;
        data: {
            url: string;
        };
        message: string;
    };
    getOptimizedImageUrl(publicId: string, width?: string, height?: string, quality?: string): {
        success: boolean;
        data: {
            url: string;
        };
        message: string;
    };
}
