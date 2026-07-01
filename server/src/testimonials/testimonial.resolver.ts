import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Testimonial, SubmitTestimonialResponse } from './models/testimonial.model';
import { TestimonialService } from './testimonial.service';
import { CreateTestimonialInput } from './dto/create-testimonial.input';
import { UpdateTestimonialInput } from './dto/update-testimonial.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Resolver(() => Testimonial)
export class TestimonialResolver {
  constructor(private readonly service: TestimonialService) {}

  // --- Public Mutations & Queries ---
  @Mutation(() => SubmitTestimonialResponse)
  async submitTestimonial(
    @Args('createTestimonialInput')
    input: CreateTestimonialInput,
  ) {
    return await this.service.create(input);
  }

  @Query(() => [Testimonial], { name: 'approvedTestimonials' })
  async findApproved() {
    return await this.service.findApproved();
  }

  // --- Admin-only Queries ---
  @Query(() => [Testimonial], { name: 'testimonials' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAll() {
    return await this.service.findAll();
  }

  @Query(() => Testimonial, { name: 'testimonial' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findOne(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    return await this.service.findOne(id);
  }

  // --- Admin-only Mutations ---
  @Mutation(() => Testimonial)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async approveTestimonial(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    return await this.service.updateStatus(id, 'APPROVED');
  }

  @Mutation(() => Testimonial)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async rejectTestimonial(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    return await this.service.updateStatus(id, 'REJECTED');
  }

  @Mutation(() => Testimonial)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateTestimonial(
    @Args('updateTestimonialInput')
    input: UpdateTestimonialInput,
  ) {
    return await this.service.update(input);
  }

  @Mutation(() => Testimonial)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteTestimonial(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    return await this.service.remove(id);
  }
}
