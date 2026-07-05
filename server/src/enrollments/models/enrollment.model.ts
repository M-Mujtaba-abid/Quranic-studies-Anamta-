import { Field, ID, ObjectType, Int, Float, registerEnumType } from '@nestjs/graphql';
import { EnrollmentStatus, EnrollmentType, PackageTier } from '@prisma/client';
import { Student } from '../../students/models/student.model';
import { Course } from '../../courses/models/course.model';
import { Payment } from '../../payments/models/payment.model';

registerEnumType(EnrollmentStatus, {
  name: 'EnrollmentStatus',
  description: 'The status of a student enrollment in a course',
});

registerEnumType(EnrollmentType, {
  name: 'EnrollmentType',
  description: 'Whether the enrollment is a regular paid enrollment or a free trial',
});

@ObjectType()
export class Enrollment {
  @Field(() => ID)
  id!: string;

  @Field()
  studentId!: string;

  @Field()
  courseId!: string;

  @Field(() => Int, { nullable: true })
  preferredHour?: number;

  @Field(() => Int, { nullable: true })
  preferredMinute?: number;

  @Field({ nullable: true })
  preferredPeriod?: string; // "AM" or "PM"

  @Field({ nullable: true })
  preferredDays?: string; // "Monday, Wednesday, Friday"

  @Field(() => EnrollmentType)
  enrollmentType!: EnrollmentType;

  @Field(() => PackageTier, { nullable: true })
  packageTier?: PackageTier;

  @Field({ nullable: true })
  appliedCurrency?: string;

  @Field(() => Float, { nullable: true })
  appliedPrice?: number;

  @Field(() => EnrollmentStatus)
  status!: EnrollmentStatus;

  @Field(() => Student, { nullable: true })
  student?: Student;

  @Field(() => Course, { nullable: true })
  course?: Course;

  @Field(() => Payment, { nullable: true })
  payment?: Payment;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
