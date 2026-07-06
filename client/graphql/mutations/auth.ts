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
