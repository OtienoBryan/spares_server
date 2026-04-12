import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rider } from '../entities/rider.entity';

export interface CreateRiderDto {
  name: string;
  contact: string;
  cashLimit?: number;
  isActive?: boolean;
}

export interface UpdateRiderDto {
  name?: string;
  contact?: string;
  cashLimit?: number;
  isActive?: boolean;
}

@Injectable()
export class RidersService {
  constructor(
    @InjectRepository(Rider)
    private readonly riderRepository: Repository<Rider>,
  ) {}

  async findAll(): Promise<Rider[]> {
    return this.riderRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findActive(): Promise<Rider[]> {
    return this.riderRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Rider | null> {
    return this.riderRepository.findOne({ where: { id } });
  }

  async create(createRiderDto: CreateRiderDto): Promise<Rider> {
    const rider = this.riderRepository.create({
      ...createRiderDto,
      cashLimit: createRiderDto.cashLimit || 0,
      isActive: createRiderDto.isActive !== undefined ? createRiderDto.isActive : true,
    });
    
    return this.riderRepository.save(rider);
  }

  async update(id: number, updateRiderDto: UpdateRiderDto): Promise<Rider | null> {
    const rider = await this.findOne(id);
    if (!rider) {
      return null;
    }

    Object.assign(rider, updateRiderDto);
    return this.riderRepository.save(rider);
  }

  async toggleActive(id: number): Promise<Rider | null> {
    const rider = await this.findOne(id);
    if (!rider) {
      return null;
    }

    rider.isActive = !rider.isActive;
    return this.riderRepository.save(rider);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.riderRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

