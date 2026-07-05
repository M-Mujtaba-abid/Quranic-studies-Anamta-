import { gql } from '@apollo/client';

export const DONATION_FIELDS = gql`
  fragment DonationFields on Donation {
    id
    type
    donorName
    email
    description
    amount
    currency
    screenshotUrl
    screenshotPublicId
    status
    createdAt
    updatedAt
  }
`;
