"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ResendEmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendEmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let ResendEmailService = ResendEmailService_1 = class ResendEmailService {
    configService;
    logger = new common_1.Logger(ResendEmailService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    getResendClient() {
        const apiKey = this.configService.get('RESEND_API_KEY');
        if (!apiKey) {
            throw new Error('Missing RESEND_API_KEY environment variable');
        }
        return new resend_1.Resend(apiKey);
    }
    getFromEmail() {
        return (this.configService.get('RESEND_FROM_EMAIL')?.trim() ||
            'bryanotieno09@gmail.com');
    }
    async sendEmail({ to, subject, html }) {
        const resend = this.getResendClient();
        const result = await resend.emails.send({
            from: this.getFromEmail(),
            to,
            subject,
            html,
        });
        const anyResult = result;
        if (anyResult?.error) {
            const message = anyResult.error?.message || 'Resend email send failed';
            throw new Error(message);
        }
        const toDisplay = Array.isArray(to) ? to.join(', ') : to;
        this.logger.log(`Email sent to ${toDisplay} (subject: ${subject})`);
        this.logger.debug(`Resend response: ${JSON.stringify(result)}`);
    }
    async sendClientOrderConfirmation(input) {
        const customerName = input.customerName?.trim() || 'Customer';
        const customerPhone = input.customerPhone?.trim() || 'N/A';
        const customerEmail = input.customerEmail?.trim() || '';
        const paymentMethod = input.paymentMethod?.trim() || 'N/A';
        const paymentStatus = input.paymentStatus?.trim() || 'N/A';
        const itemsHtml = input.items
            .map((i) => `
          <tr>
            <td style="padding: 6px 10px; border-bottom: 1px solid #eee;">${i.name}</td>
            <td style="padding: 6px 10px; border-bottom: 1px solid #eee;">${i.quantity}</td>
            <td style="padding: 6px 10px; border-bottom: 1px solid #eee;">${i.price}</td>
            <td style="padding: 6px 10px; border-bottom: 1px solid #eee;">${i.total}</td>
          </tr>
        `)
            .join('');
        const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.4;">
        <h2 style="margin-bottom: 8px;">Order confirmed</h2>
        <p>Hi ${customerName},</p>
        <p>Thanks for your order at <b>Drinks Avenue</b>. Your order has been submitted successfully.</p>
        <p><b>Order #${input.orderNumber}</b></p>

        <p><b>Phone:</b> ${customerPhone}</p>
        ${customerEmail
            ? `<p><b>Email:</b> ${customerEmail}</p>`
            : ''}
        <p><b>Payment method:</b> ${paymentMethod}</p>
        <p><b>Payment status:</b> ${paymentStatus}</p>
        <p><b>Delivery address:</b> ${input.shippingAddress}</p>
        <p><b>Total:</b> ${input.total}</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 14px;">
          <thead>
            <tr>
              <th align="left" style="padding: 6px 10px; border-bottom: 1px solid #eee;">Item</th>
              <th align="left" style="padding: 6px 10px; border-bottom: 1px solid #eee;">Qty</th>
              <th align="left" style="padding: 6px 10px; border-bottom: 1px solid #eee;">Price</th>
              <th align="left" style="padding: 6px 10px; border-bottom: 1px solid #eee;">Line total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <p style="margin-top: 18px;">We’ll notify you once your delivery is on the way.</p>
      </div>
    `;
        await this.sendEmail({
            to: input.to,
            subject: `Order confirmed: #${input.orderNumber}`,
            html,
        });
    }
    async sendAdminNewOrderNotification(input) {
        const customerPhone = input.customerPhone?.trim() || 'N/A';
        const paymentMethod = input.paymentMethod?.trim() || 'N/A';
        const paymentStatus = input.paymentStatus?.trim() || 'N/A';
        const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.4;">
        <h2 style="margin-bottom: 8px;">New order submitted</h2>
        <p><b>Order #${input.orderNumber}</b></p>

        <p><b>Customer:</b> ${input.customerName || 'N/A'} (${input.customerEmail || 'N/A'})</p>
        <p><b>Customer phone:</b> ${customerPhone}</p>
        <p><b>Payment method:</b> ${paymentMethod}</p>
        <p><b>Payment status:</b> ${paymentStatus}</p>
        <p><b>Delivery address:</b> ${input.shippingAddress}</p>
        <p><b>Total:</b> ${input.total}</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 14px;">
          <thead>
            <tr>
              <th align="left" style="padding: 6px 10px; border-bottom: 1px solid #eee;">Item</th>
              <th align="left" style="padding: 6px 10px; border-bottom: 1px solid #eee;">Qty</th>
              <th align="left" style="padding: 6px 10px; border-bottom: 1px solid #eee;">Price</th>
              <th align="left" style="padding: 6px 10px; border-bottom: 1px solid #eee;">Line total</th>
            </tr>
          </thead>
          <tbody>
            ${input.items
            .map((i) => `
                <tr>
                  <td style="padding: 6px 10px; border-bottom: 1px solid #eee;">${i.name}</td>
                  <td style="padding: 6px 10px; border-bottom: 1px solid #eee;">${i.quantity}</td>
                  <td style="padding: 6px 10px; border-bottom: 1px solid #eee;">${i.price}</td>
                  <td style="padding: 6px 10px; border-bottom: 1px solid #eee;">${i.total}</td>
                </tr>
              `)
            .join('')}
          </tbody>
        </table>
      </div>
    `;
        await this.sendEmail({
            to: input.to,
            subject: `New order: #${input.orderNumber}`,
            html,
        });
    }
};
exports.ResendEmailService = ResendEmailService;
exports.ResendEmailService = ResendEmailService = ResendEmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ResendEmailService);
//# sourceMappingURL=resend-email.service.js.map