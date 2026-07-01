import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateTestimonialInput } from '../dto/create-testimonial.input';
import { UpdateTestimonialInput } from '../dto/update-testimonial.input';
import { Testimonial, TestimonialStatus } from '@prisma/client';

@Injectable()
export class TestimonialRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(input: CreateTestimonialInput): Promise<Testimonial> {
    return await this.database.testimonial.create({
      data: {
        name: input.name,
        gender: input.gender,
        country: input.country,
        rating: input.rating,
        description: input.description,
        status: 'PENDING',
      },
    });
  }

  async findAll(): Promise<Testimonial[]> {
    return await this.database.testimonial.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findApproved(): Promise<Testimonial[]> {
    return await this.database.testimonial.findMany({
      where: {
        status: 'APPROVED',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Testimonial | null> {
    return await this.database.testimonial.findUnique({
      where: { id },
    });
  }

  async update(input: UpdateTestimonialInput): Promise<Testimonial> {
    const { id, ...data } = input;
    return await this.database.testimonial.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Testimonial> {
    return await this.database.testimonial.delete({
      where: { id },
    });
  }
}
