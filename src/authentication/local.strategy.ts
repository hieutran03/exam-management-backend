import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { TeacherModel } from 'src/models/teachers/teachers.model';
 
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'username'
    });
  }
  async validate(email: string, password: string): Promise<TeacherModel> {
    return this.authenticationService.getAuthenticatedUser(email, password);
  }
}