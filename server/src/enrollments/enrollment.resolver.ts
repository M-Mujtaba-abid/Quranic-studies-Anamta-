import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Enrollment } from './models/enrollment.model';
import { EnrollmentProfile } from './models/enrollment-profile.model';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentInput } from './dto/create-enrollment.input';
import { UpdateEnrollmentInput } from './dto/update-enrollment.input';
import { EnrollStudentInput } from './dto/enroll-student.input';
import { StudentsService } from '../students/students.service';
import { CoursesService } from '../courses/courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Student } from '../students/models/student.model';
import { Course } from '../courses/models/course.model';
import { DatabaseService } from '../database/database.service';
import { Payment } from '../payments/models/payment.model';

@Resolver(() => Enrollment)
export class EnrollmentResolver {
  constructor(
    private readonly enrollmentService: EnrollmentService,
    private readonly studentsService: StudentsService,
    private readonly coursesService: CoursesService,
    private readonly database: DatabaseService,
  ) {}

  // --- Public Mutation (Student Registration & Enrollment) ---
  @Mutation(() => Enrollment)
  async enrollStudent(
    @Args('enrollStudentInput')
    enrollStudentInput: EnrollStudentInput,
  ) {
    return await this.enrollmentService.enrollStudent(enrollStudentInput);
  }

  // --- Public Query (To retrieve enrollment details on payment page) ---
  @Query(() => Enrollment, { name: 'publicEnrollment' })
  async findPublicOne(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    return await this.enrollmentService.findOne(id);
  }

  // --- Public Query (ID-based /my-enrollment profile page — no login required) ---
  // Looks up the enrollment purely to identify which student it belongs to, then returns
  // that student's full profile plus ALL of their enrollments (not just the one looked up),
  // matching "found via the student's email/phone" — same Student record the enrollment
  // flow already finds-or-creates by.
  @Query(() => EnrollmentProfile, { name: 'enrollmentProfile' })
  async getEnrollmentProfile(
    @Args('enrollmentId', { type: () => ID })
    enrollmentId: string,
  ) {
    const enrollment = await this.enrollmentService.findOne(enrollmentId);
    const student = await this.studentsService.findOne(enrollment.studentId);
    const enrollments = await this.studentsService.findEnrollments(student.id);
    return { student, enrollments };
  }

  // --- Admin-only Operations ---
  @Mutation(() => Enrollment)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createEnrollment(
    @Args('createEnrollmentInput')
    createEnrollmentInput: CreateEnrollmentInput,
  ) {
    return await this.enrollmentService.create(createEnrollmentInput);
  }

  @Query(() => [Enrollment], { name: 'enrollments' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAll() {
    return await this.enrollmentService.findAll();
  }

  @Query(() => Enrollment, { name: 'enrollment' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findOne(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    return await this.enrollmentService.findOne(id);
  }

  @Mutation(() => Enrollment)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateEnrollment(
    @Args('updateEnrollmentInput')
    updateEnrollmentInput: UpdateEnrollmentInput,
  ) {
    return await this.enrollmentService.update(updateEnrollmentInput);
  }

  @Mutation(() => Enrollment)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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

  @ResolveField(() => Payment, { nullable: true })
  async payment(@Parent() enrollment: Enrollment) {
    return await this.database.payment.findUnique({
      where: { enrollmentId: enrollment.id },
    });
  }
}
