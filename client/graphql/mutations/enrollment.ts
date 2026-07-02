import { gql } from '@apollo/client';
import { ENROLLMENT_FIELDS } from '../fragments/enrollment';

export const ENROLL_STUDENT_MUTATION = gql`
  mutation EnrollStudent($enrollStudentInput: EnrollStudentInput!) {
    enrollStudent(enrollStudentInput: $enrollStudentInput) {
      ...EnrollmentFields
    }
  }
  ${ENROLLMENT_FIELDS}
`;

export const UPDATE_ENROLLMENT_MUTATION = gql`
  mutation UpdateEnrollment($updateEnrollmentInput: UpdateEnrollmentInput!) {
    updateEnrollment(updateEnrollmentInput: $updateEnrollmentInput) {
      ...EnrollmentFields
    }
  }
  ${ENROLLMENT_FIELDS}
`;

export const DELETE_ENROLLMENT_MUTATION = gql`
  mutation DeleteEnrollment($id: ID!) {
    deleteEnrollment(id: $id) {
      id
    }
  }
`;

