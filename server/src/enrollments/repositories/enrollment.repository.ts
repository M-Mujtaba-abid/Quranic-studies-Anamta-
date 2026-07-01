import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateEnrollmentInput } from '../dto/create-enrollment.input';
import { UpdateEnrollmentInput } from '../dto/update-enrollment.input';
import { Enrollment } from '@prisma/client';

@Injectable()
export class EnrollmentRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(createEnrollmentInput: CreateEnrollmentInput): Promise<Enrollment> {
    return await this.database.enrollment.create({
      data: createEnrollmentInput,
    });
  }

  async findAll(): Promise<Enrollment[]> {
    return await this.database.enrollment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Enrollment | null> {
    return await this.database.enrollment.findUnique({
      where: {
        id,
      },
    });
  }

  async findByStudentAndCourse(studentId: string, courseId: string): Promise<Enrollment | null> {
    return await this.database.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });
  }

  async update(updateEnrollmentInput: UpdateEnrollmentInput): Promise<Enrollment> {
    const { id, ...data } = updateEnrollmentInput;

    return await this.database.enrollment.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Enrollment> {
    return await this.database.enrollment.delete({
      where: {
        id,
      },
    });
  }
}
