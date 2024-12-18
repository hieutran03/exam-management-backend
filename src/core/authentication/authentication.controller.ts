import { Controller, Post, Req, Res, Body, UseGuards, HttpCode, Patch, HttpException, HttpStatus } from '@nestjs/common';
import { RequestWithUser, RequestWithUserDetails } from './requestWithUsers.interface';
import { AuthenticationService } from './authentication.service';
import { Response } from 'express';
import { RegisterDto } from '../../models/authentication/dtos/register.dto';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import { ChangePasswordDTO } from 'src/models/teachers/dtos/change-password.dto';
import { TeachersService } from 'src/teachers/teachers.service';
import JwtAuthenticationGuard from './jwtAuthentication.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { TeacherDTO } from 'src/models/teachers/dtos/teacher.dto';
@Serialize(TeacherDTO)
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: TeachersService
  ) {}
  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    try {
      const user = await this.authenticationService.register(registrationData);
      return user;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  login(@Req() request: RequestWithUserDetails, @Res({passthrough: true}) response: Response) {
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
