import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    return await this.database.user.create({
      data: createUserInput,
    });
  }

  async findAll(): Promise<User[]> {
    return await this.database.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.database.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.database.user.findUnique({
      where: { email },
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return await this.database.user.findFirst({
      where: {
        resetToken: token,
      },
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return await this.database.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return await this.database.user.delete({
      where: { id },
    });
  }
}
