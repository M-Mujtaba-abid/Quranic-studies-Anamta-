import { gql } from '@apollo/client';
import { CONTACT_MESSAGE_FIELDS } from '../fragments/contact';

export const SUBMIT_CONTACT_MESSAGE = gql`
  mutation SubmitContactMessage($createContactMessageInput: CreateContactMessageInput!) {
    submitContactMessage(createContactMessageInput: $createContactMessageInput) {
      ...ContactMessageFields
    }
  }
  ${CONTACT_MESSAGE_FIELDS}
`;

export const MARK_CONTACT_MESSAGE_AS_READ = gql`
  mutation MarkContactMessageAsRead($id: ID!) {
    markContactMessageAsRead(id: $id) {
      ...ContactMessageFields
    }
  }
  ${CONTACT_MESSAGE_FIELDS}
`;

export const REPLY_TO_CONTACT_MESSAGE = gql`
  mutation ReplyToContactMessage($id: ID!, $replyContent: String!) {
    replyToContactMessage(id: $id, replyContent: $replyContent) {
      ...ContactMessageFields
    }
  }
  ${CONTACT_MESSAGE_FIELDS}
`;

export const DELETE_CONTACT_MESSAGE = gql`
  mutation DeleteContactMessage($id: ID!) {
    deleteContactMessage(id: $id) {
      id
    }
  }
`;
