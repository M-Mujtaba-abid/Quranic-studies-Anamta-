export const ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  COURSES: '/courses',
  COURSE_DETAILS: (id: string) => `/courses/${id}`,
  TESTIMONIALS: '/testimonials',
  CONTACT: '/contact',
  ENROLLMENT: '/enrollment',
  PAYMENT: '/payment',

  // Admin routes
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_ENROLLMENTS: '/admin/enrollments',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_PAYMENT_SETTINGS: '/admin/payment-settings',
  ADMIN_TESTIMONIALS: '/admin/testimonials',
  ADMIN_CONTACT: '/admin/contact',
  ADMIN_SETTINGS: '/admin/settings',
};

// Routes that require ADMIN role
export const PROTECTED_ADMIN_ROUTES = [
  ROUTES.ADMIN_DASHBOARD,
  ROUTES.ADMIN_STUDENTS,
  ROUTES.ADMIN_COURSES,
  ROUTES.ADMIN_ENROLLMENTS,
  ROUTES.ADMIN_PAYMENTS,
  ROUTES.ADMIN_PAYMENT_SETTINGS,
  ROUTES.ADMIN_TESTIMONIALS,
  ROUTES.ADMIN_CONTACT,
  ROUTES.ADMIN_SETTINGS,
];
