import { Controller, Post, Req, Res, Body, UseGuards, HttpCode, Patch } from '@nestjs/common';
import { RequestWithUser } from './requestWithUsers.interface';
import { AuthenticationService } from './authentication.service';
import { Response } from 'express';
import { RegisterDto } from '../../models/authentication/dtos/register.dto';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import { ChangePasswordDTO } from 'src/models/teachers/dtos/change-password.dto';
import { TeachersService } from 'src/teachers/teachers.service';
import JwtAuthenticationGuard from './jwtAuthentication.guard';
import { log } from 'console';
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: TeachersService
  ) {}
  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  login(@Req() request: RequestWithUser, @Res({passthrough: true}) response: Response) {
    const { user } = request;
    const token = this.authenticationService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', token);
    // return token;
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch('password')
  changePassword(
    @Req() request, 
    @Body() body: ChangePasswordDTO){
    const user = request.user;
    return this.userService.updatePassword(user.id, body.password);
  }

  @Post('logout')
  logout(@Res({passthrough: true}) response: Response){
    response.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
    return response.send();
  }
}
