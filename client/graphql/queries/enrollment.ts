import { gql } from '@apollo/client';
import { STUDENT_FIELDS } from '../fragments/student';
import { COURSE_FIELDS } from '../fragments/course';
import { PAYMENT_FIELDS } from '../fragments/payment';
import { ENROLLMENT_FIELDS } from '../fragments/enrollment';

export const GET_PUBLIC_ENROLLMENT = gql`
  query GetPublicEnrollment($id: ID!) {
    publicEnrollment(id: $id) {
      id
      preferredHour
      preferredMinute
      preferredPeriod
      preferredDays
      enrollmentType
      packageTier
      appliedCurrency
      appliedPrice
      status
      createdAt
      updatedAt
      student {
        ...StudentFields
      }
      course {
        ...CourseFields
      }
      payment {
        ...PaymentFields
      }
    }
  }
  ${STUDENT_FIELDS}
  ${COURSE_FIELDS}
  ${PAYMENT_FIELDS}
`;

export const GET_ALL_ENROLLMENTS = gql`
  query GetAllEnrollments {
    enrollments {
      ...EnrollmentFields
      student {
        ...StudentFields
      }
      course {
        ...CourseFields
      }
      payment {
        ...PaymentFields
      }
    }
  }
  ${ENROLLMENT_FIELDS}
  ${STUDENT_FIELDS}
  ${COURSE_FIELDS}
  ${PAYMENT_FIELDS}
`;

