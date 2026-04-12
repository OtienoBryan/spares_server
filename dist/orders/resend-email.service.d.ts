import { ConfigService } from '@nestjs/config';
type SendOrderEmailInput = {
    to: string | string[];
    subject: string;
    html: string;
};
export declare class ResendEmailService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    private getResendClient;
    private getFromEmail;
    sendEmail({ to, subject, html }: SendOrderEmailInput): Promise<void>;
    sendClientOrderConfirmation(input: {
        to: string;
        orderNumber: string;
        customerName?: string;
        customerPhone?: string;
        customerEmail?: string;
        shippingAddress: string;
        total: number;
        paymentMethod?: string;
        paymentStatus?: string;
        items: {
            name: string;
            quantity: number;
            price: number;
            total: number;
        }[];
    }): Promise<void>;
    sendAdminNewOrderNotification(input: {
        to: string | string[];
        orderNumber: string;
        customerName?: string;
        customerEmail?: string;
        customerPhone?: string;
        shippingAddress: string;
        total: number;
        paymentMethod?: string;
        paymentStatus?: string;
        items: {
            name: string;
            quantity: number;
            price: number;
            total: number;
        }[];
    }): Promise<void>;
}
export {};
