import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update.course.input';
import { ReorderCoursesInput } from './dto/reorder-courses.input';
import { CourseRepository } from './repositories/course.repository';
import { mapCountryToRegion } from '../common/utils/region.util';
import { Region, Course } from '@prisma/client';
import cloudinary from '../upload/cloudinary.config';
import { SubscriberService } from '../newsletter/subscriber.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly subscriberService: SubscriberService,
    private readonly mailService: MailService,
  ) {}

  async create(createCourseInput: CreateCourseInput) {
    let createdCourse;
    try {
      createdCourse = await this.courseRepository.create(createCourseInput);
    } catch (error) {
      // If DB creation fails, clean up the uploaded image from Cloudinary to avoid orphan files
      if (createCourseInput.imageId) {
        try {
          await cloudinary.uploader.destroy(createCourseInput.imageId);
        } catch (destroyError) {
          console.error(
            `Failed to destroy image ${createCourseInput.imageId} on creation failure:`,
            destroyError,
          );
        }
      }
      throw error;
    }

    // Notify newsletter subscribers asynchronously — must not slow down or fail course creation
    this.notifySubscribersOfNewCourse(createdCourse).catch((err) =>
      console.error('Failed to notify subscribers of new course:', err),
    );

    return createdCourse;
  }

  private async notifySubscribersOfNewCourse(course: Course) {
    const subscribers = await this.subscriberService.findAllActive();
    if (subscribers.length === 0) return;

    await this.mailService.sendNewCourseAnnouncement(
      subscribers.map((subscriber) => subscriber.email),
      course,
    );
  }

  async findAll() {
    return await this.courseRepository.findAll();
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findById(id);

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    return course;
  }

  async update(updateCourseInput: UpdateCourseInput) {
    const existingCourse = await this.findOne(updateCourseInput.id);
    const oldImageId = existingCourse.imageId;
    const newImageId = updateCourseInput.imageId;

    const updatedCourse = await this.courseRepository.update(updateCourseInput);

    // If the image was changed, clean up the old image from Cloudinary
    if (newImageId && oldImageId && newImageId !== oldImageId) {
      try {
        await cloudinary.uploader.destroy(oldImageId);
      } catch (error) {
        console.error(
          `Failed to destroy old image ${oldImageId} on Cloudinary after update:`,
          error,
        );
      }
    }

    return updatedCourse;
  }

  async reorder(reorderCoursesInput: ReorderCoursesInput) {
    return await this.courseRepository.reorder(reorderCoursesInput.items);
  }

  async remove(id: string) {
    const course = await this.findOne(id);
    const imageId = course.imageId;

    const deletedCourse = await this.courseRepository.delete(id);

    // After deleting the course from database, delete its image from Cloudinary
    if (imageId) {
      try {
        await cloudinary.uploader.destroy(imageId);
      } catch (error) {
        console.error(
          `Failed to destroy image ${imageId} on Cloudinary after deleting course:`,
          error,
        );
      }
    }

    return deletedCourse;
  }

  async getCoursePricesForRegion(courseId: string, countryCode?: string) {
    await this.findOne(courseId);

    const region = mapCountryToRegion(countryCode);
    let packages = await this.courseRepository.findPackagesByCourseAndRegion(courseId, region);

    // Fall back to OTHERS pricing when nothing is configured for the resolved region.
    if (packages.length === 0 && region !== Region.OTHERS) {
      packages = await this.courseRepository.findPackagesByCourseAndRegion(courseId, Region.OTHERS);
    }

    return packages;
  }
}
