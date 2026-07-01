import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateStudentInput } from '../dto/create-student.input';
import { UpdateStudentInput } from '../dto/update-student.input';
import { Student } from '@prisma/client'; // Prisma ki generated type import karein

@Injectable()
export class StudentRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(createStudentInput: CreateStudentInput): Promise<Student> {
    return await this.database.student.create({
      data: createStudentInput,
    });
  }

  async findAll(): Promise<Student[]> {
    return await this.database.student.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // FindById single student ya null return karega agar nahi mila
  async findById(id: string): Promise<Student | null> {
    return await this.database.student.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<Student | null> {
    return await this.database.student.findUnique({
      where: {
        email,
      },
    });
  }

  async update(updateStudentInput: UpdateStudentInput): Promise<Student> {
    const { id, ...data } = updateStudentInput;

    return await this.database.student.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Student> {
    return await this.database.student.delete({
      where: {
        id,
      },
    });
  }

  async findEnrollments(studentId: string) {
    return await this.database.enrollment.findMany({
      where: {
        studentId,
      },
    });
  }
}
