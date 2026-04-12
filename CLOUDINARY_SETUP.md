# Cloudinary Backend Setup Guide

This guide will help you set up Cloudinary image uploads for the backend API.

## 1. Prerequisites

- Node.js and npm installed
- Cloudinary account (free tier available)
- Backend dependencies installed (`npm install`)

## 2. Create a Cloudinary Account

1. Go to [Cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

## 3. Get Your Cloudinary Credentials

1. Log into your Cloudinary dashboard
2. Go to the "Dashboard" section
3. Copy the following values:
   - **Cloud Name** (e.g., `your-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

## 4. Configure Environment Variables

The `.env` file has been created in the backend directory with the following structure:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=drinks_db

# Server Configuration
PORT=3001
NODE_ENV=development

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_PRESET=drinks-admin-upload

# JWT Configuration (if needed)
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=24h
```

**Important**: Replace the placeholder values with your actual Cloudinary credentials:
- Replace `your-cloud-name` with your actual Cloudinary cloud name
- Replace `your-api-key` with your actual API key
- Replace `your-api-secret` with your actual API secret

## 5. Backend Features

The Cloudinary integration provides the following API endpoints:

### Configuration Check
- `GET /cloudinary/config` - Check if Cloudinary is properly configured

### Image Upload
- `POST /cloudinary/upload` - Upload a single image
- `POST /cloudinary/upload-multiple` - Upload multiple images (max 10)

### Image Management
- `DELETE /cloudinary/delete/:publicId` - Delete a single image
- `POST /cloudinary/delete-multiple` - Delete multiple images

### Image URLs
- `GET /cloudinary/url/:publicId` - Get image URL with transformations
- `GET /cloudinary/optimized-url/:publicId` - Get optimized image URL

## 6. API Usage Examples

### Upload Single Image
```bash
curl -X POST http://localhost:3001/cloudinary/upload \
  -F "file=@image.jpg" \
  -F "folder=drinks-products" \
  -F "publicId=my-custom-id"
```

### Upload Multiple Images
```bash
curl -X POST http://localhost:3001/cloudinary/upload-multiple \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg" \
  -F "folder=drinks-products"
```

### Delete Image
```bash
curl -X DELETE http://localhost:3001/cloudinary/delete/drinks-products/image-name
```

### Get Optimized URL
```bash
curl "http://localhost:3001/cloudinary/optimized-url/drinks-products/image-name?width=300&height=200&quality=auto"
```

## 7. Service Integration

The CloudinaryService can be injected into other services:

```typescript
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(private cloudinaryService: CloudinaryService) {}

  async createProduct(productData: any, imageFile: Express.Multer.File) {
    // Upload image to Cloudinary
    const uploadResult = await this.cloudinaryService.uploadImage(
      imageFile,
      'drinks-products'
    );

    // Save product with image URL
    const product = {
      ...productData,
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id
    };

    return this.productRepository.save(product);
  }
}
```

## 8. Supported File Types

- PNG
- JPG/JPEG
- GIF
- WebP
- SVG
- MP4 (for video uploads)

## 9. File Size Limits

- Maximum file size: 10MB per file
- Maximum files per batch: 10 files
- Recommended: Under 5MB for better performance

## 10. Security Features

- Server-side validation
- File type validation
- Size limits enforcement
- Secure HTTPS URLs
- Organized folder structure

## 11. Error Handling

The service includes comprehensive error handling:

- Configuration validation
- Upload failure handling
- Delete operation validation
- Network error recovery

## 12. Testing the Configuration

1. Start the backend server:
   ```bash
   npm run start:dev
   ```

2. Check configuration status:
   ```bash
   curl http://localhost:3001/cloudinary/config
   ```

3. Expected response when properly configured:
   ```json
   {
     "configured": true,
     "message": "Cloudinary is properly configured"
   }
   ```

## 13. Production Considerations

For production deployment:

1. **Environment Variables**: Use secure environment variable management
2. **Rate Limiting**: Implement rate limiting for upload endpoints
3. **Image Processing**: Add image transformations and optimizations
4. **Monitoring**: Set up monitoring for upload success/failure rates
5. **Backup**: Consider implementing image backup strategies

## 14. Cost Management

- Free tier includes 25 GB storage and 25 GB bandwidth
- Monitor usage in the Cloudinary dashboard
- Implement image optimization to reduce bandwidth usage
- Consider upgrading if you exceed free tier limits

## 15. Troubleshooting

### Common Issues

1. **"Cloudinary is not configured" error**
   - Check your `.env` file has correct credentials
   - Ensure no extra spaces in environment variable values
   - Restart the server after updating `.env`

2. **Upload fails with 400 error**
   - Check file size (must be under 10MB)
   - Verify file type is supported
   - Ensure Cloudinary account is active

3. **Images not displaying**
   - Check the generated URLs are correct
   - Verify CORS settings if accessing from frontend
   - Ensure images are public in Cloudinary

### Debug Steps

1. Check configuration: `GET /cloudinary/config`
2. Verify environment variables are loaded
3. Check Cloudinary dashboard for upload logs
4. Review server logs for detailed error messages

## 16. Next Steps

After setting up Cloudinary:

1. Update your frontend to use the backend API endpoints
2. Implement image upload in your admin panel
3. Add image management features
4. Set up monitoring and logging
5. Consider implementing image transformations

For more information, visit the [Cloudinary Documentation](https://cloudinary.com/documentation).
