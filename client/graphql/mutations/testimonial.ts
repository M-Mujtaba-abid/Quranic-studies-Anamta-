import { gql } from '@apollo/client';
import { TESTIMONIAL_FIELDS } from '../fragments/testimonial';

export const SUBMIT_TESTIMONIAL = gql`
  mutation SubmitTestimonial($createTestimonialInput: CreateTestimonialInput!) {
    submitTestimonial(createTestimonialInput: $createTestimonialInput) {
      message
      testimonial {
        ...TestimonialFields
      }
    }
  }
  ${TESTIMONIAL_FIELDS}
`;

export const APPROVE_TESTIMONIAL = gql`
  mutation ApproveTestimonial($id: ID!) {
    approveTestimonial(id: $id) {
      ...TestimonialFields
    }
  }
  ${TESTIMONIAL_FIELDS}
`;

export const REJECT_TESTIMONIAL = gql`
  mutation RejectTestimonial($id: ID!) {
    rejectTestimonial(id: $id) {
      ...TestimonialFields
    }
  }
  ${TESTIMONIAL_FIELDS}
`;

export const UPDATE_TESTIMONIAL = gql`
  mutation UpdateTestimonial($updateTestimonialInput: UpdateTestimonialInput!) {
    updateTestimonial(updateTestimonialInput: $updateTestimonialInput) {
      ...TestimonialFields
    }
  }
  ${TESTIMONIAL_FIELDS}
`;

export const DELETE_TESTIMONIAL = gql`
  mutation DeleteTestimonial($id: ID!) {
    deleteTestimonial(id: $id) {
      id
    }
  }
`;
