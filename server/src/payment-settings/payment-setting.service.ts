import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentSettingInput } from './dto/create-payment-setting.input';
import { UpdatePaymentSettingInput } from './dto/update-payment-setting.input';
import { PaymentSettingRepository } from './repositories/payment-setting.repository';

@Injectable()
export class PaymentSettingService {
  constructor(private readonly repository: PaymentSettingRepository) {}

  async create(input: CreatePaymentSettingInput) {
    return await this.repository.create(input);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: string) {
    const setting = await this.repository.findById(id);
    if (!setting) {
      throw new NotFoundException('Payment setting not found.');
    }
    return setting;
  }

  async findActive() {
    const activeSetting = await this.repository.findActive();
    if (!activeSetting) {
      throw new NotFoundException('No active payment setting configured.');
    }
    return activeSetting;
  }

  async update(input: UpdatePaymentSettingInput) {
    await this.findOne(input.id);
    return await this.repository.update(input);
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.repository.delete(id);
  }
}
