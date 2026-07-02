import { gql } from '@apollo/client';

export const STUDENT_FIELDS = gql`
  fragment StudentFields on Student {
    id
    firstName
    lastName
    email
    phone
    gender
    city
    country
    address
    isActive
    createdAt
    updatedAt
  }
`;
