import { Field, ID, ObjectType, Int, registerEnumType } from '@nestjs/graphql';
import { EnrollmentStatus } from '@prisma/client';
import { Student } from '../../students/models/student.model';
import { Course } from '../../courses/models/course.model';
import { Payment } from '../../payments/models/payment.model';

registerEnumType(EnrollmentStatus, {
  name: 'EnrollmentStatus',
  description: 'The status of a student enrollment in a course',
});

@ObjectType()
export class Enrollment {
  @Field(() => ID)
  id!: string;

  @Field()
  studentId!: string;

  @Field()
  courseId!: string;

  @Field(() => Int)
  preferredHour!: number;

  @Field(() => Int)
  preferredMinute!: number;

  @Field()
  preferredPeriod!: string; // "AM" or "PM"

  @Field()
  preferredDays!: string; // "Monday, Wednesday, Friday"

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
