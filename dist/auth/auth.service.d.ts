import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Staff } from '../entities/staff.entity';
export declare class AuthService {
    private staffRepository;
    private jwtService;
    constructor(staffRepository: Repository<Staff>, jwtService: JwtService);
    validateStaff(email: string, password: string): Promise<any>;
    login(staff: any): Promise<{
        token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
        };
    }>;
    validateToken(token: string): Promise<any>;
}
