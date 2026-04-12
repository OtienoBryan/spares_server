import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

type SendOrderEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
};

@Injectable()
export class ResendEmailService {
  private readonly logger = new Logger(ResendEmailService.name);

  constructor(private readonly configService: ConfigService) {}

  private getResendClient() {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      throw new Error('Missing RESEND_API_KEY environment variable');
    }
    return new Resend(apiKey);
  }

  private getFromEmail() {
    return (
      this.configService.get<string>('RESEND_FROM_EMAIL')?.trim() ||
      'bryanotieno09@gmail.com'
    );
  }

  async sendEmail({ to, subject, html }: SendOrderEmailInput): Promise<void> {
    const resend = this.getResendClient();

    const result = await resend.emails.send({
      from: this.getFromEmail(),
      to,
      subject,
      html,
    });

    // Resend can return an object containing `error` without throwing.
    // Treat that as a failure so callers/logs reflect the real status.
    const anyResult = result as any;
    if (anyResult?.error) {
      const message = anyResult.error?.message || 'Resend email send failed';
      throw new Error(message);
    }

    const toDisplay = Array.isArray(to) ? to.join(', ') : to;
    this.logger.log(`Email sent to ${toDisplay} (subject: ${subject})`);
    this.logger.debug(`Resend response: ${JSON.stringify(result)}`);
  }

  async sendClientOrderConfirmation(input: {
    to: string;
    orderNumber: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    shippingAddress: string;
    total: number;
    paymentMethod?: string;
    paymentStatus?: string;
    items: { name: string; quantity: number; price: number; total: number }[];
  }): Promise<void> {
    const customerName = input.customerName?.trim() || 'Customer';
    const customerPhone = input.customerPhone?.trim() || 'N/A';
    const customerEmail = input.customerEmail?.trim() || '';
    const paymentMethod = input.paymentMethod?.trim() || 'N/A';
    const paymentStatus = input.paymentStatus?.trim() || 'N/A';

    const itemsHtml = input.items
      .map(
        (i) => `
          <tr>
            <td style="padding: 6px 10px; border-bottom: 1px solid #eee;">${i.name}</td>
            <td style="padding: 6px 10px; border-bottom: 1px solid #eee;">${i.quantity}</td>
            <td style="padding: 6px 10px; border-bottom: 1px solid #eee;">${i.price}</td>
            <td style="padding: 6px 10px; border-bottom: 1px solid #eee;">${i.total}</td>
          </tr>
        `,
      )
      .join('');

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.4;">
        <h2 style="margin-bottom: 8px;">Order confirmed</h2>
        <p>Hi ${customerName},</p>
        <p>Thanks for your order at <b>Drinks Avenue</b>. Your order has been submitted successfully.</p>
        <p><b>Order #${input.orderNumber}</b></p>

        <p><b>Phone:</b> ${customerPhone}</p>
        ${
          customerEmail
            ? `<p><b>Email:</b> ${customerEmail}</p>`
            : ''
        }
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

  async sendAdminNewOrderNotification(input: {
    to: string | string[];
    orderNumber: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    shippingAddress: string;
    total: number;
    paymentMethod?: string;
    paymentStatus?: string;
    items: { name: string; quantity: number; price: number; total: number }[];
  }): Promise<void> {
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
              .map(
                (i) => `
                <tr>
                  <td style="padding: 6px 10px; border-bottom: 1px solid #eee;">${i.name}</td>
                  <td style="padding: 6px 10px; border-bottom: 1px solid #eee;">${i.quantity}</td>
                  <td style="padding: 6px 10px; border-bottom: 1px solid #eee;">${i.price}</td>
                  <td style="padding: 6px 10px; border-bottom: 1px solid #eee;">${i.total}</td>
                </tr>
              `,
              )
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
}

