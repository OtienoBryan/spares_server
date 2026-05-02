import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @Get('featured')
  async findFeatured() {
    return this.productsService.findFeatured();
  }

  @Get('popular-wines')
  async findPopularWines() {
    return this.productsService.findPopularWines();
  }

  @Get('search')
  async search(@Query('q') query: string) {
    if (!query) {
      return [];
    }
    return this.productsService.search(query);
  }

  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.productsService.findByCategory(categoryId);
  }

  @Get('vehicle-make/:makeId')
  async findByVehicleMake(@Param('makeId', ParseIntPipe) makeId: number) {
    return this.productsService.findByVehicleMake(makeId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }
}
