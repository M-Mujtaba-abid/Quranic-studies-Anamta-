import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentInput } from './dto/create-student.input';
import { UpdateStudentInput } from './dto/update-student.input';
import { StudentRepository } from './repositories/student.repository';

@Injectable()
export class StudentsService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async create(createStudentInput: CreateStudentInput) {
    // Email check
    const existingEmail = await this.studentRepository.findByEmail(
      createStudentInput.email,
    );

    if (existingEmail) {
      throw new ConflictException('Email already exists.');
    }

    // Phone is unique too (schema.prisma) — check it explicitly so a clash surfaces as a
    // friendly conflict instead of an unhandled Prisma "Unique constraint failed" crash.
    const existingPhone = await this.studentRepository.findByPhone(
      createStudentInput.phone,
    );

    if (existingPhone) {
      throw new ConflictException('Phone number already exists.');
    }

    return await this.studentRepository.create(createStudentInput);
  }

  async findAll() {
    return await this.studentRepository.findAll();
  }

  async findOne(id: string) {
    const student = await this.studentRepository.findById(id);

    if (!student) {
      throw new NotFoundException('Student not found.');
    }

    return student;
  }

  async findOneByEmail(email: string) {
    return await this.studentRepository.findByEmail(email);
  }

  async findOneByPhone(phone: string) {
    return await this.studentRepository.findByPhone(phone);
  }

  async update(updateStudentInput: UpdateStudentInput) {
    await this.findOne(updateStudentInput.id);

    return await this.studentRepository.update(updateStudentInput);
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.studentRepository.delete(id);
  }

  async findEnrollments(studentId: string) {
    return await this.studentRepository.findEnrollments(studentId);
  }
}
