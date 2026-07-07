import { gql } from '@apollo/client';

export const GET_COUNTRIES = gql`
  query GetCountries($enrollmentMode: EnrollmentMode!) {
    countries(enrollmentMode: $enrollmentMode) {
      id
      name
      code
      currency
      supportedModes
    }
  }
`;
