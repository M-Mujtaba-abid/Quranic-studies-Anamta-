import { gql } from '@apollo/client';

export const PAYMENT_FIELDS = gql`
  fragment PaymentFields on Payment {
    id
    enrollmentId
    amount
    paymentMethod
    transactionId
    screenshotUrl
    status
    adminNote
    paidAt
    createdAt
    updatedAt
  }
`;
