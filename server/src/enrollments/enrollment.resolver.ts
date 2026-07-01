import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Enrollment } from './models/enrollment.model';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentInput } from './dto/create-enrollment.input';
import { UpdateEnrollmentInput } from './dto/update-enrollment.input';
import { StudentsService } from '../students/students.service';
import { CoursesService } from '../courses/courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Student } from '../students/models/student.model';
import { Course } from '../courses/models/course.model';

@Resolver(() => Enrollment)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class EnrollmentResolver {
  constructor(
    private readonly enrollmentService: EnrollmentService,
    private readonly studentsService: StudentsService,
    private readonly coursesService: CoursesService,
  ) {}

  @Mutation(() => Enrollment)
  async createEnrollment(
    @Args('createEnrollmentInput')
    createEnrollmentInput: CreateEnrollmentInput,
  ) {
    return await this.enrollmentService.create(createEnrollmentInput);
  }

  @Query(() => [Enrollment], { name: 'enrollments' })
  async findAll() {
    return await this.enrollmentService.findAll();
  }

  @Query(() => Enrollment, { name: 'enrollment' })
  async findOne(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    return await this.enrollmentService.findOne(id);
  }

  @Mutation(() => Enrollment)
  async updateEnrollment(
    @Args('updateEnrollmentInput')
    updateEnrollmentInput: UpdateEnrollmentInput,
  ) {
    return await this.enrollmentService.update(updateEnrollmentInput);
  }

  @Mutation(() => Enrollment)
  async deleteEnrollment(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    return await this.enrollmentService.remove(id);
  }

  @ResolveField(() => Student)
  async student(@Parent() enrollment: Enrollment) {
    return await this.studentsService.findOne(enrollment.studentId);
  }

  @ResolveField(() => Course)
  async course(@Parent() enrollment: Enrollment) {
    return await this.coursesService.findOne(enrollment.courseId);
  }
}
