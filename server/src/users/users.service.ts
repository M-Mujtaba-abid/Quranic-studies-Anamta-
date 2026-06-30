import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UserRepository } from './repositories/user.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserInput: CreateUserInput) {
    const existingUser = await this.userRepository.findByEmail(createUserInput.email);
    if (existingUser) {
      throw new ConflictException('Email already registered.');
    }

    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    return await this.userRepository.create({
      ...createUserInput,
      password: hashedPassword,
    });
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  async findOneByResetToken(token: string) {
    return await this.userRepository.findByResetToken(token);
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return await this.userRepository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.userRepository.delete(id);
  }
}
