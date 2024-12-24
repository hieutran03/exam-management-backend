import { Controller, Get, Patch, Param, Body, ParseIntPipe, UseGuards, Post, Delete} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { ChangePasswordDTO } from 'src/models/teachers/dtos/change-password.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { TeacherDTO } from 'src/models/teachers/dtos/teacher.dto';
import PermissionGuard from 'src/core/roles/permission.guard';
import PermissionEnum from 'src/core/roles/permission.enum';
import { AuthenticationService } from 'src/core/authentication/authentication.service';
import RegisterDto from 'src/models/authentication/dtos/register.dto';
import { UpdateTeacherDTO } from 'src/models/teachers/dtos/update-teacher.dto';

@Serialize(TeacherDTO)
@Controller('teachers')
export class TeachersController {
  constructor(
    private teacherService: TeachersService,
    private readonly authenticationService: AuthenticationService,
  ){}
  
  @UseGuards(PermissionGuard(PermissionEnum.TEACHER_READ))
  @Get()
  getAllTeacher(){
    return this.teacherService.find();
  }

  @UseGuards(PermissionGuard(PermissionEnum.TEACHER_READ))
  @Get('/:id')
  getTeacherById(@Param('id', ParseIntPipe) id: number){
    return this.teacherService.findById(id);
  }

  @UseGuards(PermissionGuard(PermissionEnum.TEACHER_READ))
  @Get('/:id/details')
  getTeacherWithDetails(@Param('id', ParseIntPipe) id: number){
    return this.teacherService.findWithDetails(id);
  }

  @UseGuards(PermissionGuard(PermissionEnum.TEACHER_MODIFY))
  @Post()
  createTeacher(@Body() body: RegisterDto){
    return this.authenticationService.register(body);
  }

  @UseGuards(PermissionGuard(PermissionEnum.TEACHER_MODIFY))
  @Patch('/:id/password')
  changePassword(
    @Param('id', ParseIntPipe)id: number,
    @Body() body: ChangePasswordDTO){
    return this.teacherService.updatePassword(id, body.password);
  }

  @UseGuards(PermissionGuard(PermissionEnum.TEACHER_MODIFY))
  @Patch('/:id')
  updateTeacher(
    @Param('id', ParseIntPipe)id: number,
    @Body() body: UpdateTeacherDTO){
    return this.teacherService.update(id, body);
  }

  @UseGuards(PermissionGuard(PermissionEnum.TEACHER_MODIFY))
  @Delete('/:id')
  deleteTeacher(@Param('id', ParseIntPipe) id: number){
    return this.teacherService.delete(id);
  }
}
