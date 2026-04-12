import { ConfigService } from '@nestjs/config';
export declare class CloudinaryService {
    private configService;
    constructor(configService: ConfigService);
    uploadImage(file: Express.Multer.File, folder?: string, publicId?: string): Promise<{
        public_id: string;
        secure_url: string;
        width: number;
        height: number;
        format: string;
        bytes: number;
    }>;
    uploadMultipleImages(files: Express.Multer.File[], folder?: string): Promise<Array<{
        public_id: string;
        secure_url: string;
        width: number;
        height: number;
        format: string;
        bytes: number;
    }>>;
    deleteImage(publicId: string): Promise<boolean>;
    deleteMultipleImages(publicIds: string[]): Promise<boolean>;
    getOptimizedImageUrl(publicId: string, width?: number, height?: number, quality?: string): string;
    getImageUrl(publicId: string, transformations?: any): string;
    isConfigured(): boolean;
}
