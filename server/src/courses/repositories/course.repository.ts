import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateCourseInput } from '../dto/create-course.input';
import { UpdateCourseInput } from '../dto/update.course.input';
import { Course } from '@prisma/client';

@Injectable()
export class CourseRepository {
  constructor(private readonly database: DatabaseService) { }

  async create(createCourseInput: CreateCourseInput): Promise<Course> {
    return await this.database.course.create({
      data: createCourseInput,
    });
  }

  async findAll(): Promise<Course[]> {
    return await this.database.course.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Course | null> {
    return await this.database.course.findUnique({
      where: {
        id,
      },
    });
  }

  async update(updateCourseInput: UpdateCourseInput): Promise<Course> {
    const { id, ...data } = updateCourseInput;

    return await this.database.course.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Course> {
    return await this.database.course.delete({
      where: {
        id,
      },
    });
  }
}
