import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreatePaymentSettingInput } from '../dto/create-payment-setting.input';
import { UpdatePaymentSettingInput } from '../dto/update-payment-setting.input';
import { PaymentSetting } from '@prisma/client';

@Injectable()
export class PaymentSettingRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(input: CreatePaymentSettingInput): Promise<PaymentSetting> {
    const { isActive, ...data } = input;
    const activeValue = isActive ?? true;

    if (activeValue) {
      // In a transaction, make all other settings inactive, then create the active one
      return await this.database.$transaction(async (tx) => {
        await tx.paymentSetting.updateMany({
          data: { isActive: false },
        });
        return await tx.paymentSetting.create({
          data: {
            ...data,
            isActive: true,
          },
        });
      });
    } else {
      return await this.database.paymentSetting.create({
        data: {
          ...data,
          isActive: false,
        },
      });
    }
  }

  async findAll(): Promise<PaymentSetting[]> {
    return await this.database.paymentSetting.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<PaymentSetting | null> {
    return await this.database.paymentSetting.findUnique({
      where: { id },
    });
  }

  async findActive(): Promise<PaymentSetting | null> {
    return await this.database.paymentSetting.findFirst({
      where: { isActive: true },
    });
  }

  async update(input: UpdatePaymentSettingInput): Promise<PaymentSetting> {
    const { id, isActive, ...data } = input;

    if (isActive === true) {
      return await this.database.$transaction(async (tx) => {
        await tx.paymentSetting.updateMany({
          data: { isActive: false },
        });
        return await tx.paymentSetting.update({
          where: { id },
          data: {
            ...data,
            isActive: true,
          },
        });
      });
    } else {
      return await this.database.paymentSetting.update({
        where: { id },
        data: {
          ...data,
          ...(isActive !== undefined ? { isActive } : {}),
        },
      });
    }
  }

  async delete(id: string): Promise<PaymentSetting> {
    return await this.database.paymentSetting.delete({
      where: { id },
    });
  }
}
