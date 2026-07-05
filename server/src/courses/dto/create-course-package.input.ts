import { Field, Float, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Region, PackageTier } from '@prisma/client';

@InputType()
export class CreateCoursePackageInput {
  @Field(() => Region)
  @IsEnum(Region, { message: 'A valid region is required.' })
  region!: Region;

  @Field()
  @IsNotEmpty({ message: 'Currency is required.' })
  @IsString()
  currency!: string;

  @Field(() => PackageTier)
  @IsEnum(PackageTier, { message: 'A valid package tier is required.' })
  packageTier!: PackageTier;

  @Field()
  @IsNotEmpty({ message: 'Package title is required.' })
  @IsString()
  title!: string;

  @Field()
  @IsNotEmpty({ message: 'Package description is required.' })
  @IsString()
  description!: string;

  @Field()
  @IsNotEmpty({ message: 'Package image URL is required.' })
  @IsString()
  imageUrl!: string;

  @Field(() => Float)
  @IsNumber({}, { message: 'Price must be a valid number.' })
  @Min(0, { message: 'Price cannot be negative.' })
  price!: number;
}
