import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnrollmentInput } from './dto/create-enrollment.input';
import { UpdateEnrollmentInput } from './dto/update-enrollment.input';
import { EnrollStudentInput } from './dto/enroll-student.input';
import { EnrollmentRepository } from './repositories/enrollment.repository';
import { StudentsService } from '../students/students.service';
import { CoursesService } from '../courses/courses.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { EnrollmentType, PackageTier } from '@prisma/client';
import { mapCountryToRegion, isLocalRegion } from '../common/utils/region.util';

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
      enrollmentType,
      packageTier,
      preferredHour,
      preferredMinute,
      preferredPeriod,
      preferredDays,
    } = enrollStudentInput;

    // 1. Verify course exists first
    const course = await this.coursesService.findOne(courseId);

    // 2. Resolve region-based pricing for this enrollment
    const pricing = await this.resolveEnrollmentPricing(courseId, country, enrollmentType, packageTier);

    // 3. Check if student already exists by email or phone — phone is unique too
    // (schema.prisma), so matching on email alone let a shared/reused phone number slip
    // through to create() and crash on the DB's unique constraint instead of updating
    // the existing record.
    let student = await this.studentsService.findOneByEmail(email);

    if (!student) {
      student = await this.studentsService.findOneByPhone(phone);
    }

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

    // 4. Prevent duplicate enrollment for this student and course
    const existingEnrollment = await this.enrollmentRepository.findByStudentAndCourse(
      student.id,
      course.id,
    );

    if (existingEnrollment) {
      throw new ConflictException('Student is already enrolled in this course.');
    }

    // 5. Create enrollment record
    const enrollment = await this.enrollmentRepository.create({
      studentId: student.id,
      courseId: course.id,
      preferredHour,
      preferredMinute,
      preferredPeriod,
      preferredDays,
      enrollmentType: pricing.enrollmentType,
      packageTier: pricing.packageTier,
      appliedCurrency: pricing.appliedCurrency,
      appliedPrice: pricing.appliedPrice,
    });

    // 6. Send emails asynchronously (so they don't block the API response)
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || 'anamtainstitute@gmail.com';
    const enrollmentForEmail = {
      ...enrollment,
      appliedPrice: enrollment.appliedPrice === null ? null : Number(enrollment.appliedPrice),
    };

    // Notification for Admin
    this.mailService.sendEnrollmentNotification(
      adminEmail,
      student,
      course,
      enrollmentForEmail
    ).catch(err => console.error('Failed to send admin enrollment notification:', err));

    // Confirmation for Student
    this.mailService.sendEnrollmentConfirmation(
      student.email,
      student,
      course,
      enrollmentForEmail
    ).catch(err => console.error('Failed to send student enrollment confirmation:', err));

    return enrollment;
  }

  private async resolveEnrollmentPricing(
    courseId: string,
    country: string | undefined,
    requestedEnrollmentType: EnrollmentType | undefined,
    requestedPackageTier: PackageTier | undefined,
  ) {
    const region = mapCountryToRegion(country);
    const packages = await this.coursesService.getCoursePricesForRegion(courseId, country);

    if (isLocalRegion(region)) {
      // Local (Pakistan) enrollments ignore any packageTier/enrollmentType the client sent —
      // there is exactly one direct PKR price and no free trial.
      const localPricing = packages.find((pkg) => pkg.packageTier === PackageTier.NONE) ?? packages[0];

      if (!localPricing) {
        throw new NotFoundException('Pricing has not been configured for this course.');
      }

      return {
        enrollmentType: EnrollmentType.REGULAR,
        packageTier: PackageTier.NONE,
        appliedCurrency: localPricing.currency,
        appliedPrice: Number(localPricing.price),
      };
    }

    if (!requestedPackageTier) {
      throw new BadRequestException('A package tier is required for international enrollment.');
    }

    const selectedPackage = packages.find((pkg) => pkg.packageTier === requestedPackageTier);

    if (!selectedPackage) {
      throw new NotFoundException('The selected package is not available for this region.');
    }

    const enrollmentType =
      requestedEnrollmentType === EnrollmentType.FREE_TRIAL
        ? EnrollmentType.FREE_TRIAL
        : EnrollmentType.REGULAR;

    return {
      enrollmentType,
      packageTier: selectedPackage.packageTier,
      appliedCurrency: selectedPackage.currency,
      appliedPrice: enrollmentType === EnrollmentType.FREE_TRIAL ? 0 : Number(selectedPackage.price),
    };
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
