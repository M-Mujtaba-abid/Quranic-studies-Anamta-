import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';
import { Region, PackageTier, EnrollmentMode } from '@prisma/client';

registerEnumType(Region, {
  name: 'Region',
  description: 'Supported pricing regions',
});

registerEnumType(PackageTier, {
  name: 'PackageTier',
  description: 'Course package tier offered to international students (NONE for local pricing)',
});

@ObjectType()
export class CoursePackage {
  @Field(() => ID)
  id!: string;

  @Field()
  courseId!: string;

  @Field(() => Region)
  region!: Region;

  @Field()
  currency!: string;

  @Field(() => PackageTier)
  packageTier!: PackageTier;

  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field()
  imageUrl!: string;

  @Field(() => Float)
  price!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class Course {
  @Field(() => ID)
  id!: string;

  @Field()
  imageUrl!: string;

  @Field()
  imageId!: string;

  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field(() => [String], { nullable: true })
  features?: string[];

  @Field(() => EnrollmentMode)
  category!: EnrollmentMode;

  @Field()
  isActive!: boolean;

  @Field(() => [CoursePackage], { nullable: true })
  packages?: CoursePackage[];

  @Field(() => [CoursePackage], { nullable: true })
  pricing?: CoursePackage[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
