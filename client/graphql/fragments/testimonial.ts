import { gql } from '@apollo/client';

export const TESTIMONIAL_FIELDS = gql`
  fragment TestimonialFields on Testimonial {
    id
    name
    gender
    country
    rating
    description
    status
    createdAt
    updatedAt
  }
`;
