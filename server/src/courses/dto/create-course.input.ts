import { Field, Float, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Length, IsString, IsNumber, Min } from 'class-validator';

@InputType()
export class CreateCourseInput {
  @Field()
  @IsNotEmpty({ message: 'Image URL is required.' })
  @IsString()
  imageUrl!: string;

  @Field()
  @IsNotEmpty({ message: 'Image ID is required.' })
  @IsString()
  imageId!: string;

  @Field()
  @IsNotEmpty({ message: 'Course title is required.' })
  @Length(3, 100)
  title!: string;

  @Field()
  @IsNotEmpty({ message: 'Description is required.' })
  description!: string;

  @Field()
  @IsNotEmpty({ message: 'Duration is required.' })
  duration!: string;

  @Field()
  @IsNotEmpty({ message: 'Days are required.' })
  days!: string;

  @Field(() => Float)
  @IsNumber({}, { message: 'Price must be a valid number.' })
  @Min(0, { message: 'Price cannot be negative.' })
  price!: number;
}
