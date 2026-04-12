import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Staff } from '../entities/staff.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    private jwtService: JwtService,
  ) {}

  async validateStaff(email: string, password: string): Promise<any> {
    const staff = await this.staffRepository.findOne({ where: { email } });
    
    if (!staff) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!staff.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(password, staff.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    staff.lastLogin = new Date();
    await this.staffRepository.save(staff);

    const { password: _, ...result } = staff;
    return result;
  }

  async login(staff: any) {
    const payload = { email: staff.email, sub: staff.id, role: staff.role };
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: staff.id,
        email: staff.email,
        firstName: staff.firstName,
        lastName: staff.lastName,
        role: staff.role,
      },
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      const staff = await this.staffRepository.findOne({ where: { id: payload.sub } });
      
      if (!staff || !staff.isActive) {
        return null;
      }

      return {
        id: staff.id,
        email: staff.email,
        firstName: staff.firstName,
        lastName: staff.lastName,
        role: staff.role,
      };
    } catch {
      return null;
    }
  }
}
