import { gql } from '@apollo/client';
import { COURSE_FIELDS, COURSE_PACKAGE_FIELDS } from '../fragments/course';

export const GET_ALL_COURSES = gql`
  query GetAllCourses {
    courses {
      ...CourseFields
    }
  }
  ${COURSE_FIELDS}
`;

export const GET_COURSE_BY_ID = gql`
  query GetCourseById($id: ID!) {
    course(id: $id) {
      ...CourseFields
    }
  }
  ${COURSE_FIELDS}
`;

export const GET_COURSE_PRICES_FOR_REGION = gql`
  query GetCoursePricesForRegion($courseId: ID!, $country: String) {
    coursePricesForRegion(courseId: $courseId, country: $country) {
      ...CoursePackageFields
    }
  }
  ${COURSE_PACKAGE_FIELDS}
`;
