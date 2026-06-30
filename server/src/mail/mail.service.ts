import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_APP_PASSWORD'),
      },
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const user = this.configService.get<string>('GMAIL_USER');
    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Quranic Studies" <${user}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2c3e50; text-align: center;">Password Reset Request</h2>
          <p>Assalamu Alaikum,</p>
          <p>You received this email because a password reset request was made for your account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
          <p style="color: #7f8c8d; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
            This link is valid for 1 hour.
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
