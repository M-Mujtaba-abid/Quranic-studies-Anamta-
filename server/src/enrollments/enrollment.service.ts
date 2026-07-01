import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnrollmentInput } from './dto/create-enrollment.input';
import { UpdateEnrollmentInput } from './dto/update-enrollment.input';
import { EnrollmentRepository } from './repositories/enrollment.repository';
import { StudentsService } from '../students/students.service';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class EnrollmentService {
  constructor(
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly studentsService: StudentsService,
    private readonly coursesService: CoursesService,
  ) {}

  async create(createEnrollmentInput: CreateEnrollmentInput) {
    // 1. Verify student exists
    await this.studentsService.findOne(createEnrollmentInput.studentId);

    // 2. Verify course exists
    await this.coursesService.findOne(createEnrollmentInput.courseId);

    // 3. Prevent duplicate enrollment
    const existingEnrollment = await this.enrollmentRepository.findByStudentAndCourse(
      createEnrollmentInput.studentId,
      createEnrollmentInput.courseId,
    );

    if (existingEnrollment) {
      throw new ConflictException('Student is already enrolled in this course.');
    }

    return await this.enrollmentRepository.create(createEnrollmentInput);
  }

  async findAll() {
    return await this.enrollmentRepository.findAll();
  }

  async findOne(id: string) {
    const enrollment = await this.enrollmentRepository.findById(id);
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found.');
    }
    return enrollment;
  }

  async update(updateEnrollmentInput: UpdateEnrollmentInput) {
    await this.findOne(updateEnrollmentInput.id);
    return await this.enrollmentRepository.update(updateEnrollmentInput);
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.enrollmentRepository.delete(id);
  }
}
