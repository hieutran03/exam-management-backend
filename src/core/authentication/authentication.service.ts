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
      if(user.role_id){
        return this.usersService.findWithDetails(user.id);
      }
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
      const checkUser = await this.usersService.findByUserName(registrationData.username);
      if(checkUser){
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
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