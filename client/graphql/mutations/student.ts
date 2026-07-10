import { gql } from '@apollo/client';

export const DELETE_STUDENT_MUTATION = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id) {
      id
    }
  }
`;
