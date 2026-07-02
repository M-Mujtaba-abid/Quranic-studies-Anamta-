import { gql } from '@apollo/client';

export const ENROLLMENT_FIELDS = gql`
  fragment EnrollmentFields on Enrollment {
    id
    studentId
    courseId
    preferredHour
    preferredMinute
    preferredPeriod
    preferredDays
    status
    createdAt
    updatedAt
  }
`;
