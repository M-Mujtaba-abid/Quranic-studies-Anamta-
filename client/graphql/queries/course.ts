import { gql } from '@apollo/client';
import { COURSE_FIELDS } from '../fragments/course';

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
