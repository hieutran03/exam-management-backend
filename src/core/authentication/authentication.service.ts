import { Injectable,  HttpException, HttpStatus  } from '@nestjs/common';
import { TeachersService } from 'src/teachers/teachers.service';
import { RegisterDto } from '../../models/authentication/dtos/register.dto';
import * as bcrypt from 'bcrypt';
import PostgresErrorCode from 'src/core/database/postgresErrorCode.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import TokenPayload from './tokenPayload.interface';
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: TeachersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
 
  
  
public async getAuthenticatedUser(username: string, plainTextPassword: string) {
  try {
    const user = await this.usersService.findByUserName(username);
    await this.verifyPassword(plainTextPassword, user.password);
    return user;
  } catch (error) {
    throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
  }
}
 
private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
  const isPasswordMatching = await bcrypt.compare(
    plainTextPassword,
    hashedPassword
  );
  if (!isPasswordMatching) {
    throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
  }
}
  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, parseInt(this.configService.get('BCRYPT_SALT_ROUNDS')));
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('User with that username already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
  }

  public getCookieForLogOut() {
    return 'Authentication=; HttpOnly; Path=/; Max-Age=0';
  }
}