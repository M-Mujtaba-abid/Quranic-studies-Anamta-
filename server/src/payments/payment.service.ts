import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';
import { PaymentRepository } from './repositories/payment.repository';
import cloudinary from '../upload/cloudinary.config';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(
    private readonly repository: PaymentRepository,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  private async deleteCloudinaryImage(publicId: string) {
    if (!publicId) return;
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(`Failed to delete Cloudinary image: ${publicId}`, error);
    }
  }

  async create(input: CreatePaymentInput) {
    // 1. Verify enrollment exists with student and course details
    const enrollment = await this.repository.findEnrollmentWithDetails(input.enrollmentId);
    if (!enrollment) {
      await this.deleteCloudinaryImage(input.screenshotPublicId);
      throw new NotFoundException('Enrollment not found.');
    }

    // 2. Prevent duplicate payment submission
    const existingPayment = await this.repository.findByEnrollmentId(input.enrollmentId);
    if (existingPayment) {
      await this.deleteCloudinaryImage(input.screenshotPublicId);
      throw new ConflictException('Payment has already been submitted for this enrollment.');
    }

    try {
      const payment = await this.repository.create(input);

      // Send email notifications asynchronously
      const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || 'anamtainstitute@gmail.com';
      
      // Notifies Admin
      this.mailService.sendPaymentSubmissionNotification(
        adminEmail,
        enrollment.student,
        enrollment.course,
        {
          amount: Number(payment.amount),
          paymentMethod: payment.paymentMethod,
          transactionId: payment.transactionId,
          screenshotUrl: payment.screenshotUrl,
        }
      ).catch(err => console.error('Failed to send admin payment submission notification:', err));

      // Confirms to Student
      this.mailService.sendPaymentSubmissionConfirmation(
        enrollment.student.email,
        enrollment.student,
        enrollment.course,
        {
          amount: Number(payment.amount),
          paymentMethod: payment.paymentMethod,
          transactionId: payment.transactionId,
        }
      ).catch(err => console.error('Failed to send student payment submission confirmation:', err));

      return payment;
    } catch (error) {
      await this.deleteCloudinaryImage(input.screenshotPublicId);
      throw error;
    }
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: string) {
    const payment = await this.repository.findById(id);
    if (!payment) {
      throw new NotFoundException('Payment record not found.');
    }
    return payment;
  }

  async findByStudentEmail(email: string) {
    return await this.repository.findByStudentEmail(email);
  }

  async update(input: UpdatePaymentInput) {
    const existingPayment = await this.findOne(input.id);
    const oldPublicId = existingPayment.screenshotPublicId;
    const newPublicId = input.screenshotPublicId;

    try {
      const updatedPayment = await this.repository.update(input);
      if (newPublicId && oldPublicId && newPublicId !== oldPublicId) {
        await this.deleteCloudinaryImage(oldPublicId);
      }
      return updatedPayment;
    } catch (error) {
      if (newPublicId && oldPublicId && newPublicId !== oldPublicId) {
        await this.deleteCloudinaryImage(newPublicId);
      }
      throw error;
    }
  }

  async remove(id: string) {
    const payment = await this.findOne(id);
    const deletedPayment = await this.repository.delete(id);
    if (deletedPayment.screenshotPublicId) {
      await this.deleteCloudinaryImage(deletedPayment.screenshotPublicId);
    }
    return deletedPayment;
  }

  async approve(id: string, adminNote?: string) {
    await this.findOne(id);
    const payment = await this.repository.approve(id, adminNote);

    // Get details for email
    const enrollment = await this.repository.findEnrollmentWithDetails(payment.enrollmentId);
    if (enrollment) {
      const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || 'anamtainstitute@gmail.com';

      // Notifies Admin
      this.mailService.sendPaymentStatusNotification(
        adminEmail,
        enrollment.student,
        enrollment.course,
        {
          amount: Number(payment.amount),
          status: payment.status,
          adminNote: payment.adminNote,
        }
      ).catch(err => console.error('Failed to send admin payment approval notification:', err));

      // Notifies Student
      this.mailService.sendPaymentStatusUpdateNotification(
        enrollment.student.email,
        enrollment.student,
        enrollment.course,
        {
          amount: Number(payment.amount),
          status: payment.status,
          adminNote: payment.adminNote,
          enrollmentId: payment.enrollmentId,
        }
      ).catch(err => console.error('Failed to send student payment status update notification:', err));
    }

    return payment;
  }

  async reject(id: string, adminNote?: string) {
    await this.findOne(id);
    const payment = await this.repository.reject(id, adminNote);

    // Get details for email
    const enrollment = await this.repository.findEnrollmentWithDetails(payment.enrollmentId);
    if (enrollment) {
      const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || 'anamtainstitute@gmail.com';

      console.log(`[PaymentService.reject] Payment ${payment.id} rejected — sending rejection email to ${enrollment.student.email} (reason: ${payment.adminNote || 'none'})`);

      // Notifies Admin
      this.mailService.sendPaymentStatusNotification(
        adminEmail,
        enrollment.student,
        enrollment.course,
        {
          amount: Number(payment.amount),
          status: payment.status,
          adminNote: payment.adminNote,
        }
      ).catch(err => console.error('Failed to send admin payment rejection notification:', err));

      // Notifies Student
      this.mailService.sendPaymentStatusUpdateNotification(
        enrollment.student.email,
        enrollment.student,
        enrollment.course,
        {
          amount: Number(payment.amount),
          status: payment.status,
          adminNote: payment.adminNote,
          enrollmentId: payment.enrollmentId,
        }
      ).catch(err => console.error('Failed to send student payment status update notification:', err));
    }

    return payment;
  }

  // Lets an admin correct a payment that already has a final status (e.g. an accidental
  // approval/rejection). Reuses the same notification templates as approve()/reject() for
  // PAID/REJECTED, and additionally keeps the enrollment status in sync since this can move a
  // payment *away* from PAID as well as into it.
  async updateStatus(id: string, status: PaymentStatus, adminNote?: string) {
    const existing = await this.findOne(id);

    if (status === 'REJECTED' && !adminNote?.trim() && !existing.adminNote) {
      throw new BadRequestException('A rejection reason is required.');
    }

    const payment = await this.repository.setStatus(id, status, adminNote);

    // Resetting to Under Review has no dedicated email template — it's a quiet correction.
    if (status === 'UNDER_REVIEW') {
      return payment;
    }

    const enrollment = await this.repository.findEnrollmentWithDetails(payment.enrollmentId);
    if (enrollment) {
      const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || 'anamtainstitute@gmail.com';

      if (status === 'REJECTED') {
        console.log(`[PaymentService.updateStatus] Payment ${payment.id} corrected to REJECTED — sending rejection email to ${enrollment.student.email} (reason: ${payment.adminNote || 'none'})`);
      }

      this.mailService.sendPaymentStatusNotification(
        adminEmail,
        enrollment.student,
        enrollment.course,
        {
          amount: Number(payment.amount),
          status: payment.status,
          adminNote: payment.adminNote,
        }
      ).catch(err => console.error('Failed to send admin payment status update notification:', err));

      this.mailService.sendPaymentStatusUpdateNotification(
        enrollment.student.email,
        enrollment.student,
        enrollment.course,
        {
          amount: Number(payment.amount),
          status: payment.status,
          adminNote: payment.adminNote,
          enrollmentId: payment.enrollmentId,
        }
      ).catch(err => console.error('Failed to send student payment status update notification:', err));
    }

    return payment;
  }

  async findEnrollment(enrollmentId: string) {
    return await this.repository.findEnrollmentById(enrollmentId);
  }
}
