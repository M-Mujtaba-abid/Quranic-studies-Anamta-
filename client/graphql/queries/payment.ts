import { gql } from '@apollo/client';
import { PAYMENT_FIELDS } from '../fragments/payment';
import { ENROLLMENT_FIELDS } from '../fragments/enrollment';
import { STUDENT_FIELDS } from '../fragments/student';
import { COURSE_FIELDS } from '../fragments/course';

export const GET_ALL_PAYMENTS = gql`
  query GetAllPayments {
    payments {
      ...PaymentFields
      enrollment {
        ...EnrollmentFields
        student {
          ...StudentFields
        }
        course {
          ...CourseFields
        }
      }
    }
  }
  ${PAYMENT_FIELDS}
  ${ENROLLMENT_FIELDS}
  ${STUDENT_FIELDS}
  ${COURSE_FIELDS}
`;
