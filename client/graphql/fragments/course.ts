import { gql } from '@apollo/client';

export const COURSE_PACKAGE_FIELDS = gql`
  fragment CoursePackageFields on CoursePackage {
    id
    courseId
    region
    currency
    packageTier
    title
    description
    imageUrl
    price
    createdAt
    updatedAt
  }
`;

export const COURSE_FIELDS = gql`
  fragment CourseFields on Course {
    id
    title
    description
    imageUrl
    imageId
    isActive
    createdAt
    updatedAt
    packages {
      ...CoursePackageFields
    }
  }
  ${COURSE_PACKAGE_FIELDS}
`;
