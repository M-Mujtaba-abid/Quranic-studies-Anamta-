import { gql } from '@apollo/client';
import { COURSE_FIELDS } from '../fragments/course';

export const CREATE_COURSE_MUTATION = gql`
  mutation CreateCourse($createCourseInput: CreateCourseInput!) {
    createCourse(createCourseInput: $createCourseInput) {
      ...CourseFields
    }
  }
  ${COURSE_FIELDS}
`;

export const UPDATE_COURSE_MUTATION = gql`
  mutation UpdateCourse($updateCourseInput: UpdateCourseInput!) {
    updateCourse(updateCourseInput: $updateCourseInput) {
      ...CourseFields
    }
  }
  ${COURSE_FIELDS}
`;

export const DELETE_COURSE_MUTATION = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id) {
      id
    }
  }
`;

export const GENERATE_UPLOAD_SIGNATURE = gql`
  mutation GenerateUploadSignature($input: GenerateUploadSignatureInput!) {
    generateUploadSignature(input: $input) {
      timestamp
      signature
      apiKey
      cloudName
      folder
    }
  }
`;
