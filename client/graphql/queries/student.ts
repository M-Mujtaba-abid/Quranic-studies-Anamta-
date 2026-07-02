import { gql } from '@apollo/client';
import { STUDENT_FIELDS } from '../fragments/student';
import { ENROLLMENT_FIELDS } from '../fragments/enrollment';

export const GET_ALL_STUDENTS = gql`
  query GetAllStudents {
    students {
      ...StudentFields
      enrollments {
        ...EnrollmentFields
        course {
          id
          title
        }
      }
    }
  }
  ${STUDENT_FIELDS}
  ${ENROLLMENT_FIELDS}
`;
