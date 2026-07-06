import { gql } from '@apollo/client';
import { USER_FIELDS } from '../fragments/user';

export const LOGIN_MUTATION = gql`
  ${USER_FIELDS}
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      token
      user {
        ...UserFields
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const REGISTER_MUTATION = gql`
  ${USER_FIELDS}
  mutation Register(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
  ) {
    register(
      createUserInput: {
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
      }
    ) {
      ...UserFields
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(resetPasswordInput: { token: $token, newPassword: $newPassword })
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(
      changePasswordInput: { currentPassword: $currentPassword, newPassword: $newPassword }
    )
  }
`;
