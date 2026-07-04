import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
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

  async sendEnrollmentNotification(
    adminEmail: string,
    student: { firstName: string; lastName: string; email: string; phone: string; address?: string | null; city?: string | null; country?: string | null },
    course: { title: string },
    enrollment: { preferredHour: number; preferredMinute: number; preferredPeriod: string; preferredDays: string }
  ) {
    const sender = this.configService.get<string>('GMAIL_USER');
    const mailOptions = {
      from: `"Anamta Institute Admin Portal" <${sender}>`,
      to: adminEmail,
      subject: `🚨 New Enrollment Request: ${student.firstName} ${student.lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2c3e50; text-align: center; border-bottom: 2px solid #3498db; padding-bottom: 10px;">New Student Enrollment</h2>
          <p>Assalamu Alaikum Admin,</p>
          <p>A new student has submitted an enrollment request. Here are the details:</p>
          
          <h3 style="color: #3498db; margin-top: 20px;">Student Profile</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 35%;">Full Name:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${student.firstName} ${student.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${student.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${student.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Address:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${student.address || 'N/A'}, ${student.city || 'N/A'}, ${student.country || 'N/A'}</td>
            </tr>
          </table>

          <h3 style="color: #3498db;">Course & Class Preferences</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 35%;">Course:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #2c3e50;">${course.title}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Preferred Days:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${enrollment.preferredDays}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Preferred Time:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${enrollment.preferredHour}:${enrollment.preferredMinute.toString().padStart(2, '0')} ${enrollment.preferredPeriod}</td>
            </tr>
          </table>

          <p style="margin-top: 30px; text-align: center; color: #7f8c8d; font-size: 12px; border-top: 1px solid #eee; padding-top: 15px;">
            Please log into the Admin panel to check details or verify/update this student's status.
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendEnrollmentConfirmation(
    studentEmail: string,
    student: { firstName: string; lastName: string },
    course: { title: string },
    enrollment: { preferredHour: number; preferredMinute: number; preferredPeriod: string; preferredDays: string }
  ) {
    const sender = this.configService.get<string>('GMAIL_USER');
    const mailOptions = {
      from: `"Anamta Institute" <${sender}>`,
      to: studentEmail,
      subject: `📚 Enrollment Request Received: ${course.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2e7d32; text-align: center; border-bottom: 2px solid #2e7d32; padding-bottom: 10px;">Enrollment Confirmation</h2>
          <p>Assalamu Alaikum ${student.firstName},</p>
          <p>Thank you for submitting your enrollment request for the course: <strong>${course.title}</strong>.</p>
          <p>Here are your registered class details for verification:</p>
          
          <div style="background-color: #f1f8e9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px; font-weight: bold; width: 40%;">Course Title:</td>
                <td style="padding: 6px;">${course.title}</td>
              </tr>
              <tr>
                <td style="padding: 6px; font-weight: bold;">Preferred Days:</td>
                <td style="padding: 6px;">${enrollment.preferredDays}</td>
              </tr>
              <tr>
                <td style="padding: 6px; font-weight: bold;">Preferred Time:</td>
                <td style="padding: 6px;">${enrollment.preferredHour}:${enrollment.preferredMinute.toString().padStart(2, '0')} ${enrollment.preferredPeriod}</td>
              </tr>
              <tr>
                <td style="padding: 6px; font-weight: bold;">Current Status:</td>
                <td style="padding: 6px; color: #f57c00; font-weight: bold;">PENDING APPROVAL</td>
              </tr>
            </table>
          </div>

          <p>Our academic administration team is reviewing your preferences and will get in touch with you shortly to finalize your schedule.</p>
          <p>If you have any questions or notice any errors in the details, please reach out to us at <a href="mailto:anamtainstitute@gmail.com">anamtainstitute@gmail.com</a>.</p>
          
          <p style="margin-top: 30px; text-align: center; color: #7f8c8d; font-size: 12px; border-top: 1px solid #eee; padding-top: 15px;">
            JazakAllahu Khairan,<br/>
            <strong>Quranic Studies Anamta Institute Team</strong>
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPaymentSubmissionNotification(
    adminEmail: string,
    student: { firstName: string; lastName: string; email: string },
    course: { title: string },
    payment: { amount: number; paymentMethod: string; transactionId?: string | null; screenshotUrl: string }
  ) {
    const sender = this.configService.get<string>('GMAIL_USER');
    const mailOptions = {
      from: `"Anamta Institute Billing" <${sender}>`,
      to: adminEmail,
      subject: `💳 New Payment Submitted: ${student.firstName} ${student.lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2c3e50; text-align: center; border-bottom: 2px solid #3498db; padding-bottom: 10px;">New Payment Submitted</h2>
          <p>Assalamu Alaikum Admin,</p>
          <p>A student has submitted payment proof for verification. Details are below:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">Student Name:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${student.firstName} ${student.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Student Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${student.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Course:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${course.title}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Amount Paid:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; color: #2e7d32; font-weight: bold;">Rs. ${payment.amount}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Payment Method:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${payment.paymentMethod}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Transaction ID:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${payment.transactionId || 'N/A'}</td>
            </tr>
          </table>

          <div style="text-align: center; margin: 20px 0;">
            <a href="${payment.screenshotUrl}" target="_blank" style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">View Payment Screenshot</a>
          </div>

          <p style="margin-top: 30px; text-align: center; color: #7f8c8d; font-size: 12px; border-top: 1px solid #eee; padding-top: 15px;">
            Please log into the Admin portal to review and approve/reject this payment.
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPaymentSubmissionConfirmation(
    studentEmail: string,
    student: { firstName: string; lastName: string },
    course: { title: string },
    payment: { amount: number; paymentMethod: string; transactionId?: string | null }
  ) {
    const sender = this.configService.get<string>('GMAIL_USER');
    const mailOptions = {
      from: `"Anamta Institute" <${sender}>`,
      to: studentEmail,
      subject: `💳 Payment Proof Submitted - Review Pending`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2e7d32; text-align: center; border-bottom: 2px solid #2e7d32; padding-bottom: 10px;">Payment Proof Submitted</h2>
          <p>Assalamu Alaikum ${student.firstName},</p>
          <p>We have successfully received your payment proof for the course <strong>${course.title}</strong>.</p>
          <p>Your payment details are currently under review by our accounts department:</p>
          
          <div style="background-color: #f1f8e9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px; font-weight: bold; width: 40%;">Amount:</td>
                <td style="padding: 6px;">Rs. ${payment.amount}</td>
              </tr>
              <tr>
                <td style="padding: 6px; font-weight: bold;">Method:</td>
                <td style="padding: 6px;">${payment.paymentMethod}</td>
              </tr>
              <tr>
                <td style="padding: 6px; font-weight: bold;">Transaction ID:</td>
                <td style="padding: 6px;">${payment.transactionId || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 6px; font-weight: bold;">Verification Status:</td>
                <td style="padding: 6px; color: #f57c00; font-weight: bold;">UNDER REVIEW</td>
              </tr>
            </table>
          </div>

          <p>Once our team verifies the transfer, your enrollment will be activated and you will receive a confirmation email. This typically takes 12-24 hours.</p>
          <p>JazakAllahu Khairan for your patience.</p>
          
          <p style="margin-top: 30px; text-align: center; color: #7f8c8d; font-size: 12px; border-top: 1px solid #eee; padding-top: 15px;">
            Quranic Studies Anamta Institute Team
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPaymentStatusNotification(
    adminEmail: string,
    student: { firstName: string; lastName: string },
    course: { title: string },
    payment: { amount: number; status: string; adminNote?: string | null }
  ) {
    const sender = this.configService.get<string>('GMAIL_USER');
    const mailOptions = {
      from: `"Anamta Institute Billing" <${sender}>`,
      to: adminEmail,
      subject: `📢 Payment Status Changed: ${student.firstName} - ${payment.status}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2c3e50; text-align: center; border-bottom: 2px solid #2c3e50; padding-bottom: 10px;">Payment Status Updated</h2>
          <p>Assalamu Alaikum Admin,</p>
          <p>The status of a payment has been updated.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">Student Name:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${student.firstName} ${student.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Course:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${course.title}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Amount:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">Rs. ${payment.amount}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">New Status:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: ${payment.status === 'PAID' ? '#2e7d32' : '#c62828'};">${payment.status}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Admin Note:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-style: italic;">${payment.adminNote || 'None'}</td>
            </tr>
          </table>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPaymentStatusUpdateNotification(
    studentEmail: string,
    student: { firstName: string; lastName: string },
    course: { title: string },
    payment: { amount: number; status: string; adminNote?: string | null }
  ) {
    const sender = this.configService.get<string>('GMAIL_USER');
    const isApproved = payment.status === 'PAID';
    const statusText = isApproved ? 'APPROVED' : 'REJECTED';
    const themeColor = isApproved ? '#2e7d32' : '#c62828';

    const mailOptions = {
      from: `"Anamta Institute" <${sender}>`,
      to: studentEmail,
      subject: `📢 Payment Status Update: ${statusText} for ${course.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: ${themeColor}; text-align: center; border-bottom: 2px solid ${themeColor}; padding-bottom: 10px;">Payment ${statusText}</h2>
          <p>Assalamu Alaikum ${student.firstName},</p>
          <p>The verification process for your payment of <strong>Rs. ${payment.amount}</strong> for the course <strong>${course.title}</strong> is complete.</p>
          
          <div style="background-color: ${isApproved ? '#f1f8e9' : '#ffebee'}; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px; font-weight: bold; width: 40%;">Course:</td>
                <td style="padding: 6px;">${course.title}</td>
              </tr>
              <tr>
                <td style="padding: 6px; font-weight: bold;">Amount:</td>
                <td style="padding: 6px;">Rs. ${payment.amount}</td>
              </tr>
              <tr>
                <td style="padding: 6px; font-weight: bold;">Status:</td>
                <td style="padding: 6px; color: ${themeColor}; font-weight: bold;">${statusText}</td>
              </tr>
              ${!isApproved && payment.adminNote ? `
              <tr>
                <td style="padding: 6px; font-weight: bold;">Reason / Note:</td>
                <td style="padding: 6px; color: #d32f2f;">${payment.adminNote}</td>
              </tr>` : ''}
            </table>
          </div>

          ${isApproved ? `
          <p><strong>Your enrollment is now APPROVED and fully active!</strong> Our academic coordinator will contact you shortly with class links and login details.</p>
          ` : `
          <p>Unfortunately, we were unable to verify your payment. Please review the note above and submit a new payment proof, or contact support at <a href="mailto:anamtainstitute@gmail.com">anamtainstitute@gmail.com</a> if you think this is a mistake.</p>
          `}

          <p style="margin-top: 30px; text-align: center; color: #7f8c8d; font-size: 12px; border-top: 1px solid #eee; padding-top: 15px;">
            Quranic Studies Anamta Institute Team
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendContactReplyEmail(
    toEmail: string,
    name: string,
    originalSubject: string,
    replyContent: string
  ) {
    const sender = this.configService.get<string>('GMAIL_USER');
    const mailOptions = {
      from: `"Anamta Institute Support" <${sender}>`,
      to: toEmail,
      subject: `Re: ${originalSubject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Support Team Response</h2>
          <p>Assalamu Alaikum ${name},</p>
          <p>Thank you for contacting us. We have reviewed your query regarding "<strong>${originalSubject}</strong>".</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #3498db; border-radius: 4px; margin: 20px 0; white-space: pre-wrap; line-height: 1.6;">${replyContent}</div>
          
          <p>If you have any further questions, feel free to reply to this email.</p>
          
          <p style="margin-top: 30px; text-align: center; color: #7f8c8d; font-size: 12px; border-top: 1px solid #eee; padding-top: 15px;">
            JazakAllahu Khairan,<br/>
            <strong>Quranic Studies Anamta Institute Team</strong>
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
