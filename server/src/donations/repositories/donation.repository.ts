import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateDonationInput } from '../dto/create-donation.input';
import { Donation, DonationStatus } from '@prisma/client';

@Injectable()
export class DonationRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(input: CreateDonationInput): Promise<Donation> {
    return await this.database.donation.create({
      data: {
        type: input.type,
        donorName: input.donorName,
        email: input.email,
        description: input.description,
        amount: input.amount,
        currency: input.currency,
        screenshotUrl: input.screenshotUrl,
        screenshotPublicId: input.screenshotPublicId,
      },
    });
  }

  async findAll(): Promise<Donation[]> {
    return await this.database.donation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Donation | null> {
    return await this.database.donation.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: string, status: DonationStatus): Promise<Donation> {
    return await this.database.donation.update({
      where: { id },
      data: { status },
    });
  }
}
