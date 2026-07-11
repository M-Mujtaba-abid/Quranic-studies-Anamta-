import { Field, ObjectType } from '@nestjs/graphql';
import { Student } from '../../students/models/student.model';
import { Enrollment } from './enrollment.model';

// Everything the ID-based /my-enrollment page needs in one round trip: the student's
// profile plus every enrollment they have (not just the one enrollmentId that was looked
// up) — course/payment on each Enrollment resolve lazily via EnrollmentResolver's existing
// field resolvers.
@ObjectType()
export class EnrollmentProfile {
  @Field(() => Student)
  student!: Student;

  @Field(() => [Enrollment])
  enrollments!: Enrollment[];
}
