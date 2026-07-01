import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaymentSetting } from './models/payment-setting.model';
import { PaymentSettingService } from './payment-setting.service';
import { CreatePaymentSettingInput } from './dto/create-payment-setting.input';
import { UpdatePaymentSettingInput } from './dto/update-payment-setting.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Resolver(() => PaymentSetting)
export class PaymentSettingResolver {
  constructor(private readonly service: PaymentSettingService) {}

  // --- Public Queries ---
  @Query(() => PaymentSetting, { name: 'activePaymentSetting' })
  async findActive() {
    return await this.service.findActive();
  }

  // --- Admin-only Queries ---
  @Query(() => [PaymentSetting], { name: 'paymentSettings' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAll() {
    return await this.service.findAll();
  }

  // --- Admin-only Mutations ---
  @Mutation(() => PaymentSetting)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createPaymentSetting(
    @Args('createPaymentSettingInput')
    input: CreatePaymentSettingInput,
  ) {
    return await this.service.create(input);
  }

  @Mutation(() => PaymentSetting)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updatePaymentSetting(
    @Args('updatePaymentSettingInput')
    input: UpdatePaymentSettingInput,
  ) {
    return await this.service.update(input);
  }

  @Mutation(() => PaymentSetting)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deletePaymentSetting(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    return await this.service.remove(id);
  }
}
