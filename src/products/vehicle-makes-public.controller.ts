import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api/vehicle-makes')
export class VehicleMakesPublicController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAll() {
    return this.productsService.getVehicleMakes();
  }
}
