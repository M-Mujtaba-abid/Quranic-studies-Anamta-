import { Args, Float, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Donation } from './models/donation.model';
import { DonationsService } from './donations.service';
import { CreateDonationInput } from './dto/create-donation.input';
import { UpdateDonationStatusInput } from './dto/update-donation-status.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Resolver(() => Donation)
export class DonationsResolver {
  constructor(private readonly service: DonationsService) {}

  // --- Public Mutation ---
  @Mutation(() => Donation)
  async createDonation(
    @Args('createDonationInput')
    input: CreateDonationInput,
  ) {
    return await this.service.createDonation(input);
  }

  // --- Admin-only Queries ---
  @Query(() => [Donation], { name: 'donations' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getDonations() {
    return await this.service.getDonations();
  }

  @Query(() => Donation, { name: 'donation' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getDonationById(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    return await this.service.getDonationById(id);
  }

  // --- Admin-only Mutation ---
  @Mutation(() => Donation)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateDonationStatus(
    @Args('updateDonationStatusInput')
    input: UpdateDonationStatusInput,
  ) {
    return await this.service.updateDonationStatus(input);
  }

  // --- Field Resolver: Prisma Decimal -> GraphQL Float ---
  @ResolveField(() => Float)
  amount(@Parent() donation: any) {
    if (donation.amount === null || donation.amount === undefined) {
      return 0;
    }
    const parsed = Number(donation.amount);
    return isNaN(parsed) ? 0 : parsed;
  }
}
