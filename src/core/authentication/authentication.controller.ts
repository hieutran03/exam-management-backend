import { Controller, Post, Req, Res, Body, UseGuards, HttpCode, Patch, HttpException, HttpStatus, Get } from '@nestjs/common';
import { RequestWithUserDetails } from './requestWithUsers.interface';
import { AuthenticationService } from './authentication.service';
import { Response } from 'express';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import { ChangePasswordDTO } from 'src/models/teachers/dtos/change-password.dto';
import { TeachersService } from 'src/teachers/teachers.service';
import JwtAuthenticationGuard from './jwtAuthentication.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { TeacherDTO } from 'src/models/teachers/dtos/teacher.dto';
@Serialize(TeacherDTO)
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: TeachersService
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get('my-profile')
  getMyProfile(@Req() request: RequestWithUserDetails){
    return this.userService.findWithDetails(request.user.id);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  login(@Req() request: RequestWithUserDetails, @Res({passthrough: true}) response: Response) {
    const { user } = request;
    const token = this.authenticationService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', token);
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
  }

}
