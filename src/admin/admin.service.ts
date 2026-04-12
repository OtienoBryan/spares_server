import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { Brand } from '../entities/brand.entity';
import { SubCategory } from '../entities/subcategory.entity';
import { Staff } from '../entities/staff.entity';
import { Blog } from '../entities/blog.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  // Dashboard statistics
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

  // Products management
  async getAllProducts() {
    const products = await this.productRepository.find({
      relations: ['category', 'brandEntity', 'subcategory'],
      order: { createdAt: 'DESC' },
    });

    // Debug: Log raw isOnOffer values from database
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
      } else {
        console.warn('[getAllProducts] onOfferCount > 0 but no sample found');
      }
    }

    // Ensure brand data is properly mapped, and cast booleans explicitly
    return products.map(product => {
      // Explicitly check if isOnOffer exists in the product object
      const isOnOfferValue = product.isOnOffer !== undefined ? product.isOnOffer : false;
      if (product.id && product.isOnOffer === undefined) {
        console.warn(`[getAllProducts] Product ${product.id} (${product.name}) has undefined isOnOffer`);
      }
      
      return {
        ...product,
        brandId: product.brandId || null,
        brand: product.brand || (product.brandEntity ? product.brandEntity.name : ''),
        brandEntity: undefined, // Remove the entity from response
        isActive: !!product.isActive,
        isFeatured: !!product.isFeatured,
        isOnOffer: !!isOnOfferValue, // Use the explicitly checked value
        isPopularWine: !!product.isPopularWine,
        requiresAgeVerification: !!product.requiresAgeVerification,
      };
    });
  }

  async getProductById(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'brandEntity', 'subcategory'],
    });

    if (!product) return null;

    // Debug: Log raw isOnOffer value from database
    console.log('[getProductById] Product loaded:', {
      id: product.id,
      name: product.name,
      isOnOffer: product.isOnOffer,
      isOnOfferType: typeof product.isOnOffer,
      hasIsOnOffer: 'isOnOffer' in product,
      allKeys: Object.keys(product).filter(k => k.includes('Offer') || k.includes('offer'))
    });

    // Explicitly check if isOnOffer exists
    const isOnOfferValue = product.isOnOffer !== undefined ? product.isOnOffer : false;
    if (product.isOnOffer === undefined) {
      console.warn(`[getProductById] Product ${id} has undefined isOnOffer - checking database directly...`);
      // Try a raw query to verify the column exists
      const rawResult = await this.productRepository.query(
        'SELECT id, name, isOnOffer FROM products WHERE id = ?',
        [id]
      );
      console.log('[getProductById] Raw SQL result:', rawResult);
      if (rawResult && rawResult[0]) {
        const rawIsOnOffer = rawResult[0].isOnOffer;
        console.log('[getProductById] Raw isOnOffer from DB:', rawIsOnOffer, 'type:', typeof rawIsOnOffer);
      }
    }

    // Ensure brand data is properly mapped, and cast booleans explicitly
    return {
      ...product,
      brandId: product.brandId || null,
      brand: product.brand || (product.brandEntity ? product.brandEntity.name : ''),
      brandEntity: undefined, // Remove the entity from response
      isActive: !!product.isActive,
      isFeatured: !!product.isFeatured,
      isOnOffer: !!isOnOfferValue, // Use the explicitly checked value
      isPopularWine: !!product.isPopularWine,
      requiresAgeVerification: !!product.requiresAgeVerification,
    };
  }

  async createProduct(productData: any) {
    // Handle brand - fetch the brand name from brandId
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
          productData.brandId = brandId; // Ensure brandId is a number
          console.log('  ✅ Set brand name from brandId:', brand.name);
        } else {
          console.log('  ⚠️ Warning: Brand not found for brandId:', brandId);
          productData.brand = '';
          productData.brandId = null;
        }
      } else {
        productData.brand = '';
        productData.brandId = null;
        console.log('  🗑️ Cleared brand name as brandId is empty or invalid');
      }
    } else {
      console.log('  ℹ️ No brandId provided for product creation');
    }

    // Handle subcategoryId
    if (productData.subcategoryId !== undefined && productData.subcategoryId !== null) {
      const subcategoryId = parseInt(productData.subcategoryId);
      if (subcategoryId && !isNaN(subcategoryId)) {
        productData.subcategoryId = subcategoryId;
        console.log('  Set subcategoryId:', subcategoryId);
      } else {
        productData.subcategoryId = null;
        console.log('  Cleared subcategoryId as it is empty or invalid');
      }
    } else {
      productData.subcategoryId = null;
    }
    
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  async updateProduct(id: number, productData: any) {
    console.log('🔧 [AdminService] updateProduct called with:');
    console.log('  ID:', id);
    console.log('  Product Data:', JSON.stringify(productData, null, 2));
    console.log('  Subcategory ID in request:', productData.subcategoryId);
    console.log('  Subcategory ID type:', typeof productData.subcategoryId);
    console.log('  Brand ID in request:', productData.brandId);
    console.log('  Brand ID type:', typeof productData.brandId);
    
    // Log the current product before update
    const currentProduct = await this.productRepository.findOne({ 
      where: { id },
      relations: ['subcategory', 'brandEntity', 'category']
    });
    console.log('  Current Product before update:');
    console.log('    Current subcategoryId:', currentProduct?.subcategoryId);
    console.log('    Current subcategory:', currentProduct?.subcategory);
    console.log('    Current brandId:', currentProduct?.brandId);
    console.log('    Current brandEntity:', currentProduct?.brandEntity);
    
    // Handle brand update - process brandId if it's provided
    console.log('  Processing brandId update...');
    console.log('    productData.brandId:', productData.brandId, '(type:', typeof productData.brandId, ')');
    console.log('    productData.brand:', productData.brand, '(type:', typeof productData.brand, ')');
    
    // Only process brandId if it's explicitly provided and not null/empty
    if (productData.brandId !== undefined && productData.brandId !== null && productData.brandId !== '' && productData.brandId !== 0) {
      const brandId = typeof productData.brandId === 'string' ? parseInt(productData.brandId) : productData.brandId;
      console.log('    Parsed brandId:', brandId, '(type:', typeof brandId, ')');
      
      if (brandId && !isNaN(brandId) && brandId > 0) {
        const brand = await this.brandRepository.findOne({ where: { id: brandId } });
        console.log('    Found brand in database:', brand);
        
        if (brand) {
          productData.brand = brand.name;
          productData.brandId = brandId; // Ensure brandId is a number
          console.log('  ✅ Updated brand name from brandId:', brand.name);
        } else {
          console.log('  ⚠️ Warning: Brand not found for brandId:', brandId);
          // Don't clear existing brand data if brand lookup fails
          console.log('  ℹ️ Keeping existing brand data due to lookup failure');
        }
      } else {
        // If brandId is invalid, clear the brand field
        productData.brand = '';
        productData.brandId = null;
        console.log('  🗑️ Cleared brand name as brandId is invalid');
      }
    } else if (productData.brandId === null || productData.brandId === '') {
      // Explicitly clearing brand
      productData.brand = '';
      productData.brandId = null;
      console.log('  🗑️ Explicitly cleared brand data');
    } else {
      console.log('  ℹ️ No brandId provided in request data - keeping existing brand');
      // Don't modify existing brand data if no brandId is provided
      delete productData.brandId;
      delete productData.brand;
    }

    // Handle subcategoryId
    console.log('  Processing subcategoryId...');
    if (productData.subcategoryId !== undefined && productData.subcategoryId !== null) {
      const subcategoryId = parseInt(productData.subcategoryId);
      console.log('    Parsed subcategoryId:', subcategoryId);
      if (subcategoryId && !isNaN(subcategoryId)) {
        // Verify subcategory exists
        const subcategory = await this.subCategoryRepository.findOne({ where: { id: subcategoryId } });
        if (subcategory) {
          productData.subcategoryId = subcategoryId;
          console.log('  ✅ Updated subcategoryId:', subcategoryId, 'for subcategory:', subcategory.name);
        } else {
          console.log('  ⚠️ Warning: Subcategory not found for subcategoryId:', subcategoryId);
          productData.subcategoryId = null;
        }
      } else {
        productData.subcategoryId = null;
        console.log('  Cleared subcategoryId as it is empty or invalid');
      }
    } else {
      console.log('  No subcategoryId in request data');
    }
    
    console.log('  Final productData before database update:');
    console.log('    brandId:', productData.brandId);
    console.log('    brand:', productData.brand);
    console.log('    subcategoryId:', productData.subcategoryId);
    console.log('    skus:', productData.skus);
    console.log('    Full data:', JSON.stringify(productData, null, 2));
    
    // Use save method instead of update for more reliable updates
    const existingProduct = await this.productRepository.findOne({ 
      where: { id },
      relations: ['category', 'brandEntity', 'subcategory']
    });
    if (!existingProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    console.log('  Existing product before merge:', JSON.stringify(existingProduct, null, 2));
    
    // Merge the existing product with the new data
    const mergedProduct = { ...existingProduct, ...productData };
    
    // Explicitly ensure SKUs are included if provided
    if (productData.skus !== undefined) {
      mergedProduct.skus = productData.skus;
      console.log('  ✅ Explicitly set SKUs:', JSON.stringify(mergedProduct.skus, null, 2));
    }
    
    console.log('  Merged product data:', JSON.stringify(mergedProduct, null, 2));
    
    // Ensure brandId is properly set
    if (productData.brandId !== undefined) {
      mergedProduct.brandId = productData.brandId;
    }
    if (productData.brand !== undefined) {
      mergedProduct.brand = productData.brand;
    }
    
    // Explicitly ensure boolean fields are properly set
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
      
      // Verify with raw SQL query
      const rawVerify = await this.productRepository.query(
        'SELECT id, name, isOnOffer FROM products WHERE id = ?',
        [id]
      );
      console.log('  🔍 Raw SQL verification after save:', rawVerify);
    } catch (saveError) {
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

  async deleteProduct(id: number) {
    return this.productRepository.delete(id);
  }

  // Categories management
  async getAllCategories() {
    return this.categoryRepository.find({
      order: { name: 'ASC' },
    });
  }

  async getCategoryById(id: number) {
    return this.categoryRepository.findOne({
      where: { id },
    });
  }

  async createCategory(categoryData: any) {
    const category = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(category);
  }

  async updateCategory(id: number, categoryData: any) {
    await this.categoryRepository.update(id, categoryData);
    return this.getCategoryById(id);
  }

  async deleteCategory(id: number) {
    return this.categoryRepository.delete(id);
  }

  // Orders management
  async getAllOrders() {
    return this.orderRepository.find({
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(id: number) {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
  }

  async updateOrderStatus(id: number, statusData: any) {
    await this.orderRepository.update(id, statusData);
    return this.getOrderById(id);
  }

  async deleteOrder(id: number) {
    return this.orderRepository.delete(id);
  }

  // Users management
  async getAllUsers() {
    return this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getUserById(id: number) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async updateUser(id: number, userData: any) {
    await this.userRepository.update(id, userData);
    return this.getUserById(id);
  }

  async toggleUserStatus(id: number) {
    const user = await this.getUserById(id);
    if (user) {
      user.isActive = !user.isActive;
      return this.userRepository.save(user);
    }
    return null;
  }

  async deleteUser(id: number) {
    return this.userRepository.delete(id);
  }

  // Staff management
  async getAllStaff() {
    return this.staffRepository.find({
      order: { createdAt: 'DESC' },
      select: ['id', 'email', 'firstName', 'lastName', 'phone', 'role', 'isActive', 'lastLogin', 'createdAt', 'updatedAt'],
    });
  }

  async getStaffById(id: number) {
    return this.staffRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'phone', 'role', 'isActive', 'lastLogin', 'createdAt', 'updatedAt'],
    });
  }

  async createStaff(staffData: any) {
    // Hash password if provided
    if (staffData.password) {
      staffData.password = await bcrypt.hash(staffData.password, 10);
    }
    
    const staff = this.staffRepository.create(staffData as Partial<Staff>);
    await this.staffRepository.save(staff);
    
    // Return without password
    const { password, ...result } = staff;
    return result;
  }

  async updateStaff(id: number, staffData: any) {
    // Hash password if provided
    if (staffData.password) {
      staffData.password = await bcrypt.hash(staffData.password, 10);
    }
    
    await this.staffRepository.update(id, staffData);
    return this.getStaffById(id);
  }

  async toggleStaffStatus(id: number) {
    const staff = await this.getStaffById(id);
    if (staff) {
      await this.staffRepository.update(id, { isActive: !staff.isActive });
      return this.getStaffById(id);
    }
    return null;
  }

  async deleteStaff(id: number) {
    return this.staffRepository.delete(id);
  }

  // Blog management
  async getAllBlogs() {
    return this.blogRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getBlogById(id: number) {
    return this.blogRepository.findOne({
      where: { id },
    });
  }

  async createBlog(blogData: any) {
    // Generate slug from title if not provided
    if (!blogData.slug && blogData.title) {
      blogData.slug = blogData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    const blog = this.blogRepository.create(blogData);
    return this.blogRepository.save(blog);
  }

  async updateBlog(id: number, blogData: any) {
    // Generate slug from title if title changed and slug not provided
    if (blogData.title && !blogData.slug) {
      blogData.slug = blogData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    await this.blogRepository.update(id, blogData);
    return this.getBlogById(id);
  }

  async deleteBlog(id: number) {
    return this.blogRepository.delete(id);
  }
}
