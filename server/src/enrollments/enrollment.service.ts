import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnrollmentInput } from './dto/create-enrollment.input';
import { UpdateEnrollmentInput } from './dto/update-enrollment.input';
import { EnrollStudentInput } from './dto/enroll-student.input';
import { EnrollmentRepository } from './repositories/enrollment.repository';
import { StudentsService } from '../students/students.service';
import { CoursesService } from '../courses/courses.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnrollmentService {
  constructor(
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly studentsService: StudentsService,
    private readonly coursesService: CoursesService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
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

  async enrollStudent(enrollStudentInput: EnrollStudentInput) {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      country,
      courseId,
      preferredHour,
      preferredMinute,
      preferredPeriod,
      preferredDays,
    } = enrollStudentInput;

    // 1. Verify course exists first
    const course = await this.coursesService.findOne(courseId);

    // 2. Check if student already exists by email
    let student = await this.studentsService.findOneByEmail(email);

    if (student) {
      // Update student profile with latest details
      student = await this.studentsService.update({
        id: student.id,
        firstName,
        lastName,
        phone,
        address,
        city,
        country,
      });
    } else {
      // Create new student profile
      student = await this.studentsService.create({
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        country,
      });
    }

    // 3. Prevent duplicate enrollment for this student and course
    const existingEnrollment = await this.enrollmentRepository.findByStudentAndCourse(
      student.id,
      course.id,
    );

    if (existingEnrollment) {
      throw new ConflictException('Student is already enrolled in this course.');
    }

    // 4. Create enrollment record
    const enrollment = await this.enrollmentRepository.create({
      studentId: student.id,
      courseId: course.id,
      preferredHour,
      preferredMinute,
      preferredPeriod,
      preferredDays,
    });

    // 5. Send emails asynchronously (so they don't block the API response)
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || 'anamtainstitute@gmail.com';
    
    // Notification for Admin
    this.mailService.sendEnrollmentNotification(
      adminEmail,
      student,
      course,
      enrollment
    ).catch(err => console.error('Failed to send admin enrollment notification:', err));

    // Confirmation for Student
    this.mailService.sendEnrollmentConfirmation(
      student.email,
      student,
      course,
      enrollment
    ).catch(err => console.error('Failed to send student enrollment confirmation:', err));

    return enrollment;
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
