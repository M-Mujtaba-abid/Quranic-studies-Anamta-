import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsInt, Min, Max, IsIn, IsOptional, IsEnum } from 'class-validator';
import { EnrollmentStatus } from '@prisma/client';

@InputType()
export class CreateEnrollmentInput {
  @Field()
  @IsNotEmpty({ message: 'Student ID is required.' })
  @IsString()
  studentId!: string;

  @Field()
  @IsNotEmpty({ message: 'Course ID is required.' })
  @IsString()
  courseId!: string;

  @Field(() => Int)
  @IsNotEmpty({ message: 'Preferred hour is required.' })
  @IsInt()
  @Min(1, { message: 'Hour must be at least 1.' })
  @Max(12, { message: 'Hour cannot be greater than 12.' })
  preferredHour!: number;

  @Field(() => Int)
  @IsNotEmpty({ message: 'Preferred minute is required.' })
  @IsInt()
  @Min(0, { message: 'Minute must be at least 0.' })
  @Max(59, { message: 'Minute cannot be greater than 59.' })
  preferredMinute!: number;

  @Field()
  @IsNotEmpty({ message: 'Preferred period (AM/PM) is required.' })
  @IsString()
  @IsIn(['AM', 'PM'], { message: 'Period must be either AM or PM.' })
  preferredPeriod!: string;

  @Field(() => EnrollmentStatus, { nullable: true })
  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;
}
