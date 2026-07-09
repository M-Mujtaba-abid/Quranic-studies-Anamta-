import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreatePaymentInput } from '../dto/create-payment.input';
import { UpdatePaymentInput } from '../dto/update-payment.input';
import { Payment, PaymentStatus, EnrollmentStatus } from '@prisma/client';

@Injectable()
export class PaymentRepository {
  constructor(private readonly database: DatabaseService) {}

  async findEnrollmentById(id: string) {
    return await this.database.enrollment.findUnique({
      where: { id },
    });
  }

  async findEnrollmentWithDetails(id: string) {
    return await this.database.enrollment.findUnique({
      where: { id },
      include: {
        student: true,
        course: true,
      },
    });
  }

  async create(input: CreatePaymentInput): Promise<Payment> {
    return await this.database.payment.create({
      data: {
        enrollmentId: input.enrollmentId,
        amount: input.amount,
        paymentMethod: input.paymentMethod,
        transactionId: input.transactionId,
        screenshotUrl: input.screenshotUrl,
        screenshotPublicId: input.screenshotPublicId,
        status: 'UNDER_REVIEW',
      },
    });
  }

  async findAll(): Promise<Payment[]> {
    return await this.database.payment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Payment | null> {
    return await this.database.payment.findUnique({
      where: { id },
    });
  }

  async findByEnrollmentId(enrollmentId: string): Promise<Payment | null> {
    return await this.database.payment.findUnique({
      where: { enrollmentId },
    });
  }

  async findByStudentEmail(email: string): Promise<Payment[]> {
    return await this.database.payment.findMany({
      where: {
        enrollment: {
          student: {
            email,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(input: UpdatePaymentInput): Promise<Payment> {
    const { id, ...data } = input;
    return await this.database.payment.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Payment> {
    return await this.database.payment.delete({
      where: { id },
    });
  }

  async approve(id: string, adminNote?: string): Promise<Payment> {
    return await this.database.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          ...(adminNote !== undefined ? { adminNote } : {}),
        },
      });

      await tx.enrollment.update({
        where: { id: payment.enrollmentId },
        data: {
          status: 'APPROVED',
        },
      });

      return payment;
    });
  }

  async reject(id: string, adminNote?: string): Promise<Payment> {
    return await this.database.payment.update({
      where: { id },
      data: {
        status: 'REJECTED',
        ...(adminNote !== undefined ? { adminNote } : {}),
      },
    });
  }

  // Corrects a payment that already has a final status (used by the admin "Edit status" flow) —
  // unlike approve()/reject(), this also syncs the enrollment status back in line so a reversed
  // decision doesn't leave the enrollment stuck on a stale APPROVED/PENDING state.
  async setStatus(id: string, status: PaymentStatus, adminNote?: string): Promise<Payment> {
    return await this.database.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id },
        data: {
          status,
          paidAt: status === 'PAID' ? new Date() : null,
          ...(adminNote !== undefined ? { adminNote } : {}),
        },
      });

      const enrollmentStatus: EnrollmentStatus =
        status === 'PAID' ? 'APPROVED' : status === 'REJECTED' ? 'REJECTED' : 'PENDING';

      await tx.enrollment.update({
        where: { id: payment.enrollmentId },
        data: { status: enrollmentStatus },
      });

      return payment;
    });
  }
}
