import { gql } from '@apollo/client';

export const CONTACT_MESSAGE_FIELDS = gql`
  fragment ContactMessageFields on ContactMessage {
    id
    name
    email
    subject
    message
    isRead
    createdAt
    updatedAt
  }
`;
