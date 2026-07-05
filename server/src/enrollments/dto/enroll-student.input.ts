import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsInt, Min, Max, IsIn, IsEnum } from 'class-validator';
import { PackageTier, EnrollmentType } from '@prisma/client';

@InputType()
export class EnrollStudentInput {
  // --- Student Fields ---
  @Field()
  @IsNotEmpty({ message: 'First name is required.' })
  @IsString()
  firstName!: string;

  @Field()
  @IsNotEmpty({ message: 'Last name is required.' })
  @IsString()
  lastName!: string;

  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email!: string;

  @Field()
  @IsNotEmpty({ message: 'Phone number is required.' })
  @IsString()
  phone!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  country?: string;

  // --- Enrollment Fields ---
  @Field()
  @IsNotEmpty({ message: 'Course ID is required.' })
  @IsString()
  courseId!: string;

  // Defaults to REGULAR in the service if omitted. Only meaningful for international
  // enrollments — local (Pakistan) enrollments never get a free trial.
  @Field(() => EnrollmentType, { nullable: true })
  @IsOptional()
  @IsEnum(EnrollmentType, { message: 'Enrollment type must be REGULAR or FREE_TRIAL.' })
  enrollmentType?: EnrollmentType;

  // Required for international students to select a package; ignored for local (Pakistan)
  // enrollments, which are priced directly from the region's CoursePackage record.
  @Field(() => PackageTier, { nullable: true })
  @IsOptional()
  @IsEnum(PackageTier, { message: 'A valid package tier is required.' })
  packageTier?: PackageTier;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Hour must be at least 1.' })
  @Max(12, { message: 'Hour cannot be greater than 12.' })
  preferredHour?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Minute must be at least 0.' })
  @Max(59, { message: 'Minute cannot be greater than 59.' })
  preferredMinute?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsIn(['AM', 'PM'], { message: 'Period must be either AM or PM.' })
  preferredPeriod?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  preferredDays?: string;
}
