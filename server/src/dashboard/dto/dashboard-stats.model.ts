import { Field, Int, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DashboardStats {
  @Field(() => Int)
  totalStudents!: number;

  @Field(() => Int)
  totalCourses!: number;

  @Field(() => Int)
  totalEnrollments!: number;

  @Field(() => Int)
  pendingPayments!: number;

  @Field(() => Int)
  paidPayments!: number;

  @Field(() => Float)
  totalRevenue!: number;

  @Field(() => Int)
  pendingTestimonials!: number;

  @Field(() => Int)
  unreadContacts!: number;
}
