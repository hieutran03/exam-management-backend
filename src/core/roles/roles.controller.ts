import { Body, Controller, Get, HttpCode, Param, Post, Put, UseGuards } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDTO } from "src/models/role/dtos/create-role.dto";
import { UpdateRoleDTO } from "src/models/role/dtos/update-role.dto";
import PermissionGuard from "./permission.guard";
import PermissionEnum from "./permission.enum";

@Controller('roles')
export default class RolesController{
  constructor(private rolesService: RolesService){}

  @UseGuards(PermissionGuard(PermissionEnum.TEACHER_READ))
  @Get()
  getRoles(){
    return this.rolesService.get();
  }

  @UseGuards(PermissionGuard(PermissionEnum.TEACHER_READ))
  @Get(':id')
  getRole(@Param('id')id: number){
    return this.rolesService.getWithDetails(id);
  }

  // @Get(':id/details')
  // getRoleWithDetails(id: number){
  //   return this.rolesService.getWithDetails(id);
  // }

  @UseGuards(PermissionGuard(PermissionEnum.TEACHER_MODIFY))
  @HttpCode(201)
  @Post()
  createRole(@Body() body : CreateRoleDTO){
    return this.rolesService.create(body);

  }

  @UseGuards(PermissionGuard(PermissionEnum.TEACHER_MODIFY))
  @Put(':id')
  updateRole(@Param('id') id: number, @Body() body: UpdateRoleDTO){
    return this.rolesService.update(id, body);
  }

}
