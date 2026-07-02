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
