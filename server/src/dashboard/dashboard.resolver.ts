import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardStats } from './dto/dashboard-stats.model';
import { PopularCourse } from './dto/popular-course.model';
import { MonthlyRevenue } from './dto/monthly-revenue.model';
import { MonthlyEnrollment } from './dto/monthly-enrollment.model';
import { StudentsByCountry } from './dto/students-by-country.model';
import { Enrollment } from '../enrollments/models/enrollment.model';
import { Payment } from '../payments/models/payment.model';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class DashboardResolver {
  constructor(private readonly service: DashboardService) {}

  @Query(() => DashboardStats, { name: 'dashboardStats' })
  async getDashboardStats() {
    return await this.service.getDashboardStats();
  }

  @Query(() => [Enrollment], { name: 'latestEnrollments' })
  async getLatestEnrollments(
    @Args('limit', { type: () => Int, defaultValue: 5 })
    limit: number,
  ) {
    return await this.service.getLatestEnrollments(limit);
  }

  @Query(() => [Payment], { name: 'latestPayments' })
  async getLatestPayments(
    @Args('limit', { type: () => Int, defaultValue: 5 })
    limit: number,
  ) {
    return await this.service.getLatestPayments(limit);
  }

  @Query(() => [PopularCourse], { name: 'popularCourses' })
  async getPopularCourses() {
    return await this.service.getPopularCourses();
  }

  @Query(() => [MonthlyRevenue], { name: 'monthlyRevenue' })
  async getMonthlyRevenue(
    @Args('year', { type: () => Int })
    year: number,
  ) {
    return await this.service.getMonthlyRevenue(year);
  }

  @Query(() => [MonthlyEnrollment], { name: 'monthlyEnrollments' })
  async getMonthlyEnrollments(
    @Args('year', { type: () => Int })
    year: number,
  ) {
    return await this.service.getMonthlyEnrollments(year);
  }

  @Query(() => [StudentsByCountry], { name: 'studentsByCountry' })
  async getStudentsByCountry() {
    return await this.service.getStudentsByCountry();
  }
}
