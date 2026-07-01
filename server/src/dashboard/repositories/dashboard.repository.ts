import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Enrollment, Payment } from '@prisma/client';

@Injectable()
export class DashboardRepository {
  constructor(private readonly database: DatabaseService) {}

  async getDashboardStats() {
    const totalStudents = await this.database.student.count();
    const totalCourses = await this.database.course.count();
    const totalEnrollments = await this.database.enrollment.count();
    
    const pendingPayments = await this.database.payment.count({
      where: { status: 'UNDER_REVIEW' },
    });
    const paidPayments = await this.database.payment.count({
      where: { status: 'PAID' },
    });

    const revenueAggregate = await this.database.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'PAID',
      },
    });
    const totalRevenue = revenueAggregate._sum.amount ? Number(revenueAggregate._sum.amount) : 0;

    const pendingTestimonials = await this.database.testimonial.count({
      where: { status: 'PENDING' },
    });

    const unreadContacts = await this.database.contactMessage.count({
      where: { isRead: false },
    });

    return {
      totalStudents,
      totalCourses,
      totalEnrollments,
      pendingPayments,
      paidPayments,
      totalRevenue,
      pendingTestimonials,
      unreadContacts,
    };
  }

  async getLatestEnrollments(limit: number): Promise<Enrollment[]> {
    return await this.database.enrollment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      include: {
        student: true,
        course: true,
      },
    });
  }

  async getLatestPayments(limit: number): Promise<Payment[]> {
    return await this.database.payment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      include: {
        enrollment: {
          include: {
            student: true,
            course: true,
          },
        },
      },
    });
  }

  async getPopularCourses() {
    const grouped = await this.database.enrollment.groupBy({
      by: ['courseId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    const courseIds = grouped.map((g) => g.courseId);
    const courses = await this.database.course.findMany({
      where: {
        id: { in: courseIds },
      },
    });

    return grouped.map((g) => {
      const course = courses.find((c) => c.id === g.courseId);
      return {
        courseId: g.courseId,
        courseTitle: course ? course.title : 'Unknown Course',
        totalEnrollments: g._count.id,
      };
    });
  }

  async getMonthlyRevenue(year: number) {
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    const payments = await this.database.payment.findMany({
      where: {
        status: 'PAID',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        amount: true,
        createdAt: true,
      },
    });

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const revenueByMonth = months.map((month) => ({
      month,
      totalRevenue: 0,
    }));

    payments.forEach((p) => {
      const monthIndex = p.createdAt.getUTCMonth();
      if (monthIndex >= 0 && monthIndex < 12) {
        revenueByMonth[monthIndex].totalRevenue += Number(p.amount);
      }
    });

    return revenueByMonth;
  }

  async getMonthlyEnrollments(year: number) {
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    const enrollments = await this.database.enrollment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const enrollmentsByMonth = months.map((month) => ({
      month,
      totalEnrollments: 0,
    }));

    enrollments.forEach((e) => {
      const monthIndex = e.createdAt.getUTCMonth();
      if (monthIndex >= 0 && monthIndex < 12) {
        enrollmentsByMonth[monthIndex].totalEnrollments += 1;
      }
    });

    return enrollmentsByMonth;
  }

  async getStudentsByCountry() {
    const grouped = await this.database.student.groupBy({
      by: ['country'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    return grouped.map((g) => ({
      country: g.country || 'Unknown',
      totalStudents: g._count.id,
    }));
  }
}
