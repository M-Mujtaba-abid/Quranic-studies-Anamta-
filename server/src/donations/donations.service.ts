import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDonationInput } from './dto/create-donation.input';
import { UpdateDonationStatusInput } from './dto/update-donation-status.input';
import { DonationRepository } from './repositories/donation.repository';
import cloudinary from '../upload/cloudinary.config';

@Injectable()
export class DonationsService {
  constructor(private readonly donationRepository: DonationRepository) {}

  async createDonation(input: CreateDonationInput) {
    try {
      return await this.donationRepository.create(input);
    } catch (error) {
      // If DB creation fails, clean up the uploaded screenshot to avoid orphan files
      try {
        await cloudinary.uploader.destroy(input.screenshotPublicId);
      } catch (destroyError) {
        console.error(
          `Failed to destroy screenshot ${input.screenshotPublicId} on creation failure:`,
          destroyError,
        );
      }
      throw error;
    }
  }

  async getDonations() {
    return await this.donationRepository.findAll();
  }

  async getDonationById(id: string) {
    const donation = await this.donationRepository.findById(id);
    if (!donation) {
      throw new NotFoundException('Donation not found.');
    }
    return donation;
  }

  async updateDonationStatus(input: UpdateDonationStatusInput) {
    await this.getDonationById(input.id);
    return await this.donationRepository.updateStatus(input.id, input.status);
  }
}
