import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateCourseInput } from '../dto/create-course.input';
import { UpdateCourseInput } from '../dto/update.course.input';
import { Course, CoursePackage, Region } from '@prisma/client';

type CourseWithPackages = Course & { packages: CoursePackage[] };

@Injectable()
export class CourseRepository {
  constructor(private readonly database: DatabaseService) { }

  async create(createCourseInput: CreateCourseInput): Promise<CourseWithPackages> {
    const { packages, ...courseData } = createCourseInput;

    return await this.database.course.create({
      data: {
        ...courseData,
        packages: {
          create: packages,
        },
      },
      include: { packages: true },
    });
  }

  async findAll(): Promise<CourseWithPackages[]> {
    return await this.database.course.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: { packages: true },
    });
  }

  async findById(id: string): Promise<CourseWithPackages | null> {
    return await this.database.course.findUnique({
      where: {
        id,
      },
      include: { packages: true },
    });
  }

  async update(updateCourseInput: UpdateCourseInput): Promise<CourseWithPackages> {
    const { id, packages, ...data } = updateCourseInput;

    // Packages are fully replaced on update rather than diffed/merged.
    if (packages) {
      await this.database.coursePackage.deleteMany({ where: { courseId: id } });
    }

    return await this.database.course.update({
      where: { id },
      data: {
        ...data,
        ...(packages && { packages: { create: packages } }),
      },
      include: { packages: true },
    });
  }

  async delete(id: string): Promise<Course> {
    return await this.database.course.delete({
      where: {
        id,
      },
    });
  }

  async findPackagesByCourseAndRegion(courseId: string, region: Region): Promise<CoursePackage[]> {
    return await this.database.coursePackage.findMany({
      where: { courseId, region },
      orderBy: { price: 'asc' },
    });
  }
}
