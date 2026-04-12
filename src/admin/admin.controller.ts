import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Dashboard statistics
  @Get('dashboard')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // Products management
  @Get('products')
  async getAllProducts() {
    return this.adminService.getAllProducts();
  }

  @Get('products/:id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getProductById(id);
  }

  @Post('products')
  async createProduct(@Body() productData: any) {
    return this.adminService.createProduct(productData);
  }

  @Put('products/:id')
  async updateProduct(@Param('id', ParseIntPipe) id: number, @Body() productData: any) {
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
    } catch (error) {
      console.error('❌ [AdminController] Error updating product:', error);
      console.error('  Error message:', error.message);
      console.error('  Error stack:', error.stack);
      throw error;
    }
  }

  private getRequestHeaders() {
    // This is a placeholder - in a real implementation, you'd inject the Request object
    return { 'content-type': 'application/json' };
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteProduct(id);
  }

  // Categories management
  @Get('categories')
  async getAllCategories() {
    return this.adminService.getAllCategories();
  }

  @Get('categories/:id')
  async getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getCategoryById(id);
  }

  @Post('categories')
  async createCategory(@Body() categoryData: any) {
    return this.adminService.createCategory(categoryData);
  }

  @Put('categories/:id')
  async updateCategory(@Param('id', ParseIntPipe) id: number, @Body() categoryData: any) {
    return this.adminService.updateCategory(id, categoryData);
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteCategory(id);
  }

  // Orders management
  @Get('orders')
  async getAllOrders() {
    return this.adminService.getAllOrders();
  }

  @Get('orders/:id')
  async getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getOrderById(id);
  }

  @Put('orders/:id/status')
  async updateOrderStatus(@Param('id', ParseIntPipe) id: number, @Body() statusData: any) {
    return this.adminService.updateOrderStatus(id, statusData);
  }

  @Delete('orders/:id')
  async deleteOrder(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteOrder(id);
  }

  // Users management
  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() userData: any) {
    return this.adminService.updateUser(id, userData);
  }

  @Put('users/:id/toggle-status')
  async toggleUserStatus(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.toggleUserStatus(id);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteUser(id);
  }

  // Staff management
  @Get('staff')
  async getAllStaff() {
    return this.adminService.getAllStaff();
  }

  @Get('staff/:id')
  async getStaffById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getStaffById(id);
  }

  @Post('staff')
  async createStaff(@Body() staffData: any) {
    return this.adminService.createStaff(staffData);
  }

  @Put('staff/:id')
  async updateStaff(@Param('id', ParseIntPipe) id: number, @Body() staffData: any) {
    return this.adminService.updateStaff(id, staffData);
  }

  @Put('staff/:id/toggle-status')
  async toggleStaffStatus(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.toggleStaffStatus(id);
  }

  @Delete('staff/:id')
  async deleteStaff(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteStaff(id);
  }

  // Blog management
  @Get('blogs')
  async getAllBlogs() {
    return this.adminService.getAllBlogs();
  }

  @Get('blogs/:id')
  async getBlogById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getBlogById(id);
  }

  @Post('blogs')
  async createBlog(@Body() blogData: any) {
    console.log('🚀 [AdminController] POST /api/admin/blogs called');
    console.log('  Blog Data:', JSON.stringify(blogData, null, 2));
    try {
      const result = await this.adminService.createBlog(blogData);
      console.log('✅ [AdminController] Blog created successfully');
      return result;
    } catch (error) {
      console.error('❌ [AdminController] Error creating blog:', error);
      throw error;
    }
  }

  @Put('blogs/:id')
  async updateBlog(@Param('id', ParseIntPipe) id: number, @Body() blogData: any) {
    return this.adminService.updateBlog(id, blogData);
  }

  @Delete('blogs/:id')
  async deleteBlog(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteBlog(id);
  }
}
