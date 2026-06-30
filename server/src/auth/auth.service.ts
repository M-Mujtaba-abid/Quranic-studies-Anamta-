import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/login.input';
import { CreateUserInput } from '../users/dto/create-user.input';
import { ChangePasswordInput } from './dto/change-password.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(createUserInput: CreateUserInput) {
    return await this.usersService.create(createUserInput);
  }

  async login(loginInput: LoginInput) {
    const user = await this.usersService.findOneByEmail(loginInput.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(
      loginInput.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user,
    };
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User with this email does not exist.');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await this.usersService.update(user.id, {
      resetToken,
      resetTokenExpiry,
    });

    try {
      await this.mailService.sendPasswordResetEmail(email, resetToken);
      return true;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new BadRequestException('Failed to send email. Please try again.');
    }
  }

  async resetPassword(resetPasswordInput: ResetPasswordInput): Promise<boolean> {
    const user = await this.usersService.findOneByResetToken(resetPasswordInput.token);
    if (!user) {
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Reset token has expired.');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordInput.newPassword, 10);

    await this.usersService.update(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return true;
  }

  async changePassword(userId: string, changePasswordInput: ChangePasswordInput): Promise<boolean> {
    const user = await this.usersService.findOne(userId);

    const isPasswordValid = await bcrypt.compare(
      changePasswordInput.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Current password does not match.');
    }

    const hashedPassword = await bcrypt.hash(changePasswordInput.newPassword, 10);

    await this.usersService.update(userId, {
      password: hashedPassword,
    });

    return true;
  }
}
