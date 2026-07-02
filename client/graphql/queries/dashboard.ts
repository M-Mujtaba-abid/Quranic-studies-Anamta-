import { gql } from '@apollo/client';

export const GET_ADMIN_DASHBOARD_DATA = gql`
  query GetAdminDashboardData($year: Int!, $limit: Int!) {
    dashboardStats {
      totalStudents
      totalCourses
      totalEnrollments
      pendingPayments
      paidPayments
      totalRevenue
      pendingTestimonials
      unreadContacts
    }
    latestEnrollments(limit: $limit) {
      id
      preferredHour
      preferredMinute
      preferredPeriod
      preferredDays
      status
      createdAt
      student {
        id
        firstName
        lastName
        email
      }
      course {
        id
        title
      }
    }
    latestPayments(limit: $limit) {
      id
      amount
      paymentMethod
      transactionId
      screenshotUrl
      status
      createdAt
      enrollment {
        id
        student {
          id
          firstName
          lastName
        }
        course {
          id
          title
        }
      }
    }
    popularCourses {
      courseId
      courseTitle
      totalEnrollments
    }
    monthlyRevenue(year: $year) {
      month
      totalRevenue
    }
    monthlyEnrollments(year: $year) {
      month
      totalEnrollments
    }
    studentsByCountry {
      country
      totalStudents
    }
  }
`;
