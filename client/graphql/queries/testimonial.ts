import { gql } from '@apollo/client';
import { TESTIMONIAL_FIELDS } from '../fragments/testimonial';

export const GET_APPROVED_TESTIMONIALS = gql`
  query GetApprovedTestimonials {
    approvedTestimonials {
      ...TestimonialFields
    }
  }
  ${TESTIMONIAL_FIELDS}
`;

export const GET_ALL_TESTIMONIALS = gql`
  query GetAllTestimonials {
    testimonials {
      ...TestimonialFields
    }
  }
  ${TESTIMONIAL_FIELDS}
`;
