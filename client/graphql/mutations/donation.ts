import { gql } from '@apollo/client';
import { DONATION_FIELDS } from '../fragments/donation';

export const SUBMIT_DONATION_MUTATION = gql`
  mutation SubmitDonation($createDonationInput: CreateDonationInput!) {
    createDonation(createDonationInput: $createDonationInput) {
      ...DonationFields
    }
  }
  ${DONATION_FIELDS}
`;

export const UPDATE_DONATION_STATUS_MUTATION = gql`
  mutation UpdateDonationStatus($updateDonationStatusInput: UpdateDonationStatusInput!) {
    updateDonationStatus(updateDonationStatusInput: $updateDonationStatusInput) {
      ...DonationFields
    }
  }
  ${DONATION_FIELDS}
`;
