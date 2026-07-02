import { Args, ID, Query, Mutation, Resolver, ResolveField, Parent, Float } from '@nestjs/graphql';
import { Course } from './models/course.model';
import { CoursesService } from './courses.service';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update.course.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Resolver(() => Course)
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

  @Mutation(() => Course)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createCourse(
    @Args('createCourseInput')
    createCourseInput: CreateCourseInput,
  ) {
    return await this.coursesService.create(createCourseInput);
  }

  @Query(() => [Course], {
    name: 'courses',
  })
  async findAllCourses() {
    return await this.coursesService.findAll();
  }

  @Query(() => Course, {
    name: 'course',
  })
  async findCourseById(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    return await this.coursesService.findOne(id);
  }

  @Mutation(() => Course)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateCourse(
    @Args('updateCourseInput')
    updateCourseInput: UpdateCourseInput,
  ) {
    return await this.coursesService.update(updateCourseInput);
  }

  @Mutation(() => Course)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteCourse(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    return await this.coursesService.remove(id);
  }

  @ResolveField(() => Float)
  price(@Parent() course: any) {
    if (course.price === null || course.price === undefined) {
      return 0;
    }
    const parsed = Number(course.price);
    return isNaN(parsed) ? 0 : parsed;
  }
}
// Trigger NestJS dev watch compile after prisma generate
