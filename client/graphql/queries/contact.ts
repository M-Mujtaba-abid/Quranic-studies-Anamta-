import { gql } from '@apollo/client';
import { CONTACT_MESSAGE_FIELDS } from '../fragments/contact';

export const GET_ALL_CONTACT_MESSAGES = gql`
  query GetAllContactMessages {
    contactMessages {
      ...ContactMessageFields
    }
  }
  ${CONTACT_MESSAGE_FIELDS}
`;

export const GET_CONTACT_MESSAGE = gql`
  query GetContactMessage($id: ID!) {
    contactMessage(id: $id) {
      ...ContactMessageFields
    }
  }
  ${CONTACT_MESSAGE_FIELDS}
`;
