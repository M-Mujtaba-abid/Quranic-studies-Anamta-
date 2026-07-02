import { gql } from '@apollo/client';

export const GET_ACTIVE_PAYMENT_SETTING = gql`
  query GetActivePaymentSetting {
    activePaymentSetting {
      id
      bankName
      accountTitle
      accountNumber
      iban
      jazzCashNumber
      easyPaisaNumber
      instructions
      isActive
    }
  }
`;

export const GET_ALL_PAYMENT_SETTINGS = gql`
  query GetAllPaymentSettings {
    paymentSettings {
      id
      bankName
      accountTitle
      accountNumber
      iban
      jazzCashNumber
      easyPaisaNumber
      instructions
      isActive
    }
  }
`;
