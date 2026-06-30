import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Length } from 'class-validator';

@InputType()
export class CreateCourseInput {
  @Field()
  @IsNotEmpty({ message: 'Course image is required.' })
  image!: string;

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
}
