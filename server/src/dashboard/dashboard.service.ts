import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './repositories/dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly repository: DashboardRepository) {}

  async getDashboardStats() {
    return await this.repository.getDashboardStats();
  }

  async getLatestEnrollments(limit: number) {
    return await this.repository.getLatestEnrollments(limit);
  }

  async getLatestPayments(limit: number) {
    return await this.repository.getLatestPayments(limit);
  }

  async getPopularCourses() {
    return await this.repository.getPopularCourses();
  }

  async getMonthlyRevenue(year: number) {
    return await this.repository.getMonthlyRevenue(year);
  }

  async getMonthlyEnrollments(year: number) {
    return await this.repository.getMonthlyEnrollments(year);
  }

  async getStudentsByCountry() {
    return await this.repository.getStudentsByCountry();
  }
}
