import { gql } from '@apollo/client';
import { PAYMENT_FIELDS } from '../fragments/payment';

export const APPROVE_PAYMENT_MUTATION = gql`
  mutation ApprovePayment($id: ID!, $adminNote: String) {
    approvePayment(id: $id, adminNote: $adminNote) {
      ...PaymentFields
    }
  }
  ${PAYMENT_FIELDS}
`;

export const REJECT_PAYMENT_MUTATION = gql`
  mutation RejectPayment($id: ID!, $adminNote: String) {
    rejectPayment(id: $id, adminNote: $adminNote) {
      ...PaymentFields
    }
  }
  ${PAYMENT_FIELDS}
`;

export const UPDATE_PAYMENT_STATUS_MUTATION = gql`
  mutation UpdatePaymentStatus($id: ID!, $status: PaymentStatus!, $adminNote: String) {
    updatePaymentStatus(id: $id, status: $status, adminNote: $adminNote) {
      ...PaymentFields
    }
  }
  ${PAYMENT_FIELDS}
`;

export const CREATE_PAYMENT_MUTATION = gql`
  mutation CreatePayment($createPaymentInput: CreatePaymentInput!) {
    createPayment(createPaymentInput: $createPaymentInput) {
      ...PaymentFields
    }
  }
  ${PAYMENT_FIELDS}
`;

