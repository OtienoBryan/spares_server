import {
  Controller,
  Post,
  Delete,
  Get,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  Param,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Get('config')
  getConfig() {
    return {
      configured: this.cloudinaryService.isConfigured(),
      message: this.cloudinaryService.isConfigured() 
        ? 'Cloudinary is properly configured' 
        : 'Cloudinary is not configured. Please set up your environment variables.'
    };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
    @Body('publicId') publicId?: string
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.cloudinaryService.isConfigured()) {
      throw new BadRequestException('Cloudinary is not configured. Please set up your environment variables.');
    }

    try {
      const result = await this.cloudinaryService.uploadImage(
        file,
        folder || 'drinks-products',
        publicId
      );
      
      return {
        success: true,
        data: result,
        message: 'Image uploaded successfully'
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  async uploadMultipleImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder?: string
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    if (!this.cloudinaryService.isConfigured()) {
      throw new BadRequestException('Cloudinary is not configured. Please set up your environment variables.');
    }

    try {
      const results = await this.cloudinaryService.uploadMultipleImages(
        files,
        folder || 'drinks-products'
      );
      
      return {
        success: true,
        data: results,
        message: `${results.length} images uploaded successfully`
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @Delete('delete/:publicId')
  async deleteImage(@Param('publicId') publicId: string) {
    if (!this.cloudinaryService.isConfigured()) {
      throw new BadRequestException('Cloudinary is not configured. Please set up your environment variables.');
    }

    try {
      const success = await this.cloudinaryService.deleteImage(publicId);
      
      if (!success) {
        throw new NotFoundException('Image not found or could not be deleted');
      }

      return {
        success: true,
        message: 'Image deleted successfully'
      };
    } catch (error) {
      throw new BadRequestException(`Delete failed: ${error.message}`);
    }
  }

  @Post('delete-multiple')
  async deleteMultipleImages(@Body('publicIds') publicIds: string[]) {
    if (!publicIds || publicIds.length === 0) {
      throw new BadRequestException('No public IDs provided');
    }

    if (!this.cloudinaryService.isConfigured()) {
      throw new BadRequestException('Cloudinary is not configured. Please set up your environment variables.');
    }

    try {
      const success = await this.cloudinaryService.deleteMultipleImages(publicIds);
      
      if (!success) {
        throw new BadRequestException('Failed to delete one or more images');
      }

      return {
        success: true,
        message: `${publicIds.length} images deleted successfully`
      };
    } catch (error) {
      throw new BadRequestException(`Delete failed: ${error.message}`);
    }
  }

  @Get('url/:publicId')
  getImageUrl(
    @Param('publicId') publicId: string,
    @Query('width') width?: string,
    @Query('height') height?: string,
    @Query('quality') quality?: string
  ) {
    if (!this.cloudinaryService.isConfigured()) {
      throw new BadRequestException('Cloudinary is not configured. Please set up your environment variables.');
    }

    const transformations: any = {};
    if (width) transformations.width = parseInt(width);
    if (height) transformations.height = parseInt(height);
    if (quality) transformations.quality = quality;

    const url = this.cloudinaryService.getImageUrl(publicId, transformations);
    
    return {
      success: true,
      data: { url },
      message: 'Image URL generated successfully'
    };
  }

  @Get('optimized-url/:publicId')
  getOptimizedImageUrl(
    @Param('publicId') publicId: string,
    @Query('width') width?: string,
    @Query('height') height?: string,
    @Query('quality') quality?: string
  ) {
    if (!this.cloudinaryService.isConfigured()) {
      throw new BadRequestException('Cloudinary is not configured. Please set up your environment variables.');
    }

    const url = this.cloudinaryService.getOptimizedImageUrl(
      publicId,
      width ? parseInt(width) : undefined,
      height ? parseInt(height) : undefined,
      quality || 'auto'
    );
    
    return {
      success: true,
      data: { url },
      message: 'Optimized image URL generated successfully'
    };
  }
}
