import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Staff } from '../entities/staff.entity';
export declare class JwtAuthGuard implements CanActivate {
    private jwtService;
    private staffRepository;
    constructor(jwtService: JwtService, staffRepository: Repository<Staff>);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
