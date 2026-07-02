import { gql } from '@apollo/client';

export const COURSE_FIELDS = gql`
  fragment CourseFields on Course {
    id
    title
    description
    imageUrl
    imageId
    duration
    days
    price
    isActive
    createdAt
    updatedAt
  }
`;
