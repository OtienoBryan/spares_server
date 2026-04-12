export declare class Staff {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: 'admin' | 'manager' | 'staff';
    isActive: boolean;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
}
