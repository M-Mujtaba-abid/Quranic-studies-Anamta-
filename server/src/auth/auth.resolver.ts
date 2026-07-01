import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { ChangePasswordInput } from './dto/change-password.input';
import { LoginResponse } from './dto/login-response.type';
import { LoginInput } from './dto/login.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserInput } from '../users/dto/create-user.input';
import { User } from '../users/models/user.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async register(
    @Args('createUserInput')
    createUserInput: CreateUserInput,
  ) {
    return await this.authService.register(createUserInput);
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput')
    loginInput: LoginInput,
    @Context() context: any,
  ) {
    const loginResponse = await this.authService.login(loginInput);
    const res = context.res || context.req?.res;

    if (res) {
      const isProd = process.env.NODE_ENV === 'production';
      res.cookie('token', loginResponse.token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    return loginResponse;
  }

  @Mutation(() => Boolean)
  async logout(@Context() context: any) {
    const res = context.res || context.req?.res;

    if (res) {
      const isProd = process.env.NODE_ENV === 'production';
      res.clearCookie('token', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
      });
    }

    return true;
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Args('email')
    email: string,
  ) {
    return await this.authService.forgotPassword(email);
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Args('resetPasswordInput')
    resetPasswordInput: ResetPasswordInput,
  ) {
    return await this.authService.resetPassword(resetPasswordInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser()
    user: any,
    @Args('changePasswordInput')
    changePasswordInput: ChangePasswordInput,
  ) {
    return await this.authService.changePassword(user.id, changePasswordInput);
  }
}
