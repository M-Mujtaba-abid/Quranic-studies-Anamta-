import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateCourseInput } from '../dto/create-course.input';
import { UpdateCourseInput } from '../dto/update.course.input';
import { CourseSortOrderInput } from '../dto/reorder-courses.input';
import { Course, CoursePackage, Region, Prisma } from '@prisma/client';

type CourseWithPackages = Prisma.CourseGetPayload<{ include: { packages: true } }>;

/** Map a CreateCoursePackageInput array to the shape Prisma expects.
 *  `title` is optional in both our DTO and the DB schema (String?), but the
 *  generated Prisma client type sometimes infers it as required depending on
 *  the client version. We build the object explicitly and cast to satisfy TS.
 */
function toPrismaPackages(
  packages: CreateCourseInput['packages'],
): Prisma.CoursePackageCreateWithoutCourseInput[] {
  return packages.map((pkg) => {
    const base = {
      region: pkg.region,
      currency: pkg.currency,
      packageTier: pkg.packageTier,
      description: pkg.description,
      imageUrl: pkg.imageUrl,
      price: pkg.price,
      title: pkg.title ?? '',
    } satisfies Prisma.CoursePackageCreateWithoutCourseInput;
    return base;
  });
}


@Injectable()
export class CourseRepository {
  constructor(private readonly database: DatabaseService) { }

  async create(createCourseInput: CreateCourseInput): Promise<CourseWithPackages> {
    const { packages, ...courseData } = createCourseInput;

    return await this.database.course.create({
      data: {
        ...courseData,
        packages: {
          create: toPrismaPackages(packages),
        },
      },
      include: { packages: true },
    });
  }

  async findAll(): Promise<CourseWithPackages[]> {
    return await this.database.course.findMany({
      // sortOrder drives manual admin ordering; createdAt is only a tiebreaker for
      // rows that share a sortOrder (e.g. legacy rows before backfill/reordering).
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
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
        ...(packages && { packages: { create: toPrismaPackages(packages) } }),
      },
      include: { packages: true },
    });
  }

  async reorder(items: CourseSortOrderInput[]): Promise<CourseWithPackages[]> {
    return await this.database.$transaction(
      items.map((item) =>
        this.database.course.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
          include: { packages: true },
        }),
      ),
    );
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
