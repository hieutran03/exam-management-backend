import { Controller, Post, Req, Res, Body } from '@nestjs/common';
import { RequestWithUser } from './requestWithUsers.interface';
import { AuthenticationService } from './authentication.service';
import { Response } from 'express';
import { RegisterDto } from '../models/authentication/dtos/register.dto';
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @Post('login')
  login(@Req() request: RequestWithUser, @Res({passthrough: true}) response: Response): string {
    const { user } = request;
    const token = this.authenticationService.login(user);
    response.cookie('Authorization', token, { httpOnly: true });
    return token;
  }
}
