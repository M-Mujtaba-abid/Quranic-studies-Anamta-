import { gql } from '@apollo/client';

export const CREATE_PAYMENT_SETTING = gql`
  mutation CreatePaymentSetting($createPaymentSettingInput: CreatePaymentSettingInput!) {
    createPaymentSetting(createPaymentSettingInput: $createPaymentSettingInput) {
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

export const UPDATE_PAYMENT_SETTING = gql`
  mutation UpdatePaymentSetting($updatePaymentSettingInput: UpdatePaymentSettingInput!) {
    updatePaymentSetting(updatePaymentSettingInput: $updatePaymentSettingInput) {
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

export const DELETE_PAYMENT_SETTING = gql`
  mutation DeletePaymentSetting($id: ID!) {
    deletePaymentSetting(id: $id) {
      id
    }
  }
`;
