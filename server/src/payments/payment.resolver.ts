import { Args, ID, Mutation, Query, Resolver, ResolveField, Parent, Float } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Payment } from './models/payment.model';
import { PaymentService } from './payment.service';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { Enrollment } from '../enrollments/models/enrollment.model';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly service: PaymentService) {}

  // --- Public Mutations ---
  @Mutation(() => Payment)
  async createPayment(
    @Args('createPaymentInput')
    input: CreatePaymentInput,
  ) {
    return await this.service.create(input);
  }

  // --- Authenticated User Queries ---
  @Query(() => [Payment], { name: 'myPayments' })
  @UseGuards(JwtAuthGuard)
  async myPayments(@CurrentUser() user: any) {
    return await this.service.findByStudentEmail(user.email);
  }

  // --- Admin-only Queries ---
  @Query(() => [Payment], { name: 'payments' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAll() {
    return await this.service.findAll();
  }

  @Query(() => Payment, { name: 'payment' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findOne(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    return await this.service.findOne(id);
  }

  // --- Admin-only Mutations ---
  @Mutation(() => Payment)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async approvePayment(
    @Args('id', { type: () => ID })
    id: string,
    @Args('adminNote', { type: () => String, nullable: true })
    adminNote?: string,
  ) {
    return await this.service.approve(id, adminNote);
  }

  @Mutation(() => Payment)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async rejectPayment(
    @Args('id', { type: () => ID })
    id: string,
    @Args('adminNote', { type: () => String, nullable: true })
    adminNote?: string,
  ) {
    return await this.service.reject(id, adminNote);
  }

  @Mutation(() => Payment)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updatePayment(
    @Args('updatePaymentInput')
    input: UpdatePaymentInput,
  ) {
    return await this.service.update(input);
  }

  @Mutation(() => Payment)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deletePayment(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    return await this.service.remove(id);
  }

  // --- Field Resolvers ---
  @ResolveField(() => Enrollment, { nullable: true })
  async enrollment(@Parent() payment: Payment) {
    return await this.service.findEnrollment(payment.enrollmentId);
  }

  @ResolveField(() => Float)
  amount(@Parent() payment: any) {
    if (payment.amount === null || payment.amount === undefined) {
      return 0;
    }
    const parsed = Number(payment.amount);
    return isNaN(parsed) ? 0 : parsed;
  }
}
