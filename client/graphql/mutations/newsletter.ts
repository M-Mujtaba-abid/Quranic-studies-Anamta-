import { gql } from '@apollo/client';

export const SUBSCRIBE_TO_NEWSLETTER = gql`
  mutation SubscribeToNewsletter($subscribeNewsletterInput: SubscribeNewsletterInput!) {
    subscribeToNewsletter(subscribeNewsletterInput: $subscribeNewsletterInput) {
      id
      email
    }
  }
`;
