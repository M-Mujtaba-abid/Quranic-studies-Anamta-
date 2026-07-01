import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestimonialInput } from './dto/create-testimonial.input';
import { UpdateTestimonialInput } from './dto/update-testimonial.input';
import { TestimonialRepository } from './repositories/testimonial.repository';
import { TestimonialStatus } from '@prisma/client';

@Injectable()
export class TestimonialService {
  constructor(private readonly repository: TestimonialRepository) {}

  async create(input: CreateTestimonialInput) {
    const testimonial = await this.repository.create(input);
    return {
      message: 'Thank you for your feedback. Your testimonial is under review.',
      testimonial,
    };
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findApproved() {
    return await this.repository.findApproved();
  }

  async findOne(id: string) {
    const testimonial = await this.repository.findById(id);
    if (!testimonial) {
      throw new NotFoundException('Testimonial not found.');
    }
    return testimonial;
  }

  async update(input: UpdateTestimonialInput) {
    await this.findOne(input.id);
    return await this.repository.update(input);
  }

  async updateStatus(id: string, status: TestimonialStatus) {
    await this.findOne(id);
    return await this.repository.update({ id, status });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.repository.delete(id);
  }
}
