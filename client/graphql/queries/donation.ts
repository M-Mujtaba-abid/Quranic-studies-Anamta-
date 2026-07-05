import { gql } from '@apollo/client';
import { DONATION_FIELDS } from '../fragments/donation';

export const GET_ALL_DONATIONS = gql`
  query GetAllDonations {
    donations {
      ...DonationFields
    }
  }
  ${DONATION_FIELDS}
`;
