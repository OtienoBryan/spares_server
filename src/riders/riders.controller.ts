import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  ParseIntPipe,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { RidersService } from './riders.service';
import type { CreateRiderDto, UpdateRiderDto } from './riders.service';

@Controller('api/riders')
export class RidersController {
  constructor(private readonly ridersService: RidersService) {}

  @Get()
  async findAll() {
    return this.ridersService.findAll();
  }

  @Get('active')
  async findActive() {
    return this.ridersService.findActive();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const rider = await this.ridersService.findOne(id);
    if (!rider) {
      throw new HttpException('Rider not found', HttpStatus.NOT_FOUND);
    }
    return rider;
  }

  @Post()
  async create(@Body() createRiderDto: CreateRiderDto) {
    try {
      return await this.ridersService.create(createRiderDto);
    } catch (error) {
      throw new HttpException('Failed to create rider', HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRiderDto: UpdateRiderDto
  ) {
    const rider = await this.ridersService.update(id, updateRiderDto);
    if (!rider) {
      throw new HttpException('Rider not found', HttpStatus.NOT_FOUND);
    }
    return rider;
  }

  @Put(':id/toggle-active')
  async toggleActive(@Param('id', ParseIntPipe) id: number) {
    const rider = await this.ridersService.toggleActive(id);
    if (!rider) {
      throw new HttpException('Rider not found', HttpStatus.NOT_FOUND);
    }
    return rider;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const success = await this.ridersService.remove(id);
    if (!success) {
      throw new HttpException('Rider not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Rider deleted successfully' };
  }
}
