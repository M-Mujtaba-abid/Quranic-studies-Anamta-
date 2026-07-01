import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsInt, Min, Max, IsIn } from 'class-validator';

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

  @Field()
  @IsNotEmpty({ message: 'Preferred days are required.' })
  @IsString()
  preferredDays!: string;
}
