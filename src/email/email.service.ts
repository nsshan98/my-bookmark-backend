import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendVerificationEmail(email: string, code: string) {
    try {
      await this.resend.emails.send({
        from: 'YourApp <no-reply@yourdomain.com>',
        to: email,
        subject: 'Verify Your Email',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 16px;">
            <h2>Email Verification</h2>
            <p>Your verification code is:</p>
            <h3>${code}</h3>
            <p>This code will expire in 15 minutes.</p>
          </div>
        `,
      });
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.log(error);
      this.logger.error(`Failed to send verification email: ${error.message}`);
      throw error;
    }
  }
}
