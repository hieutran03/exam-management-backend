import { Body, Controller, Get, HttpCode, Patch, Post } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDTO } from "src/models/role/dtos/create-role.dto";
@Controller('roles')
export default class RolesController{
  constructor(private rolesService: RolesService){}

  @Get()
  getRoles(){
    return this.rolesService.get();
  }

  @Get(':id')
  getRole(id: number){
    return this.rolesService.getById(id);
  }

  @Get(':id/details')
  getRoleWithDetails(id: number){
    return this.rolesService.getWithDetails(id);
  }

  @HttpCode(201)
  @Post()
  createRole(@Body() body : CreateRoleDTO){
    return this.rolesService.create(body.name, body.permissions);
  }

  @Patch(':id')
  updateRole(@Body('name') name: string, @Body('id') id: number){
    return this.rolesService.update(id, name);
  }

  // @Patch(':id/permissions')
  // insertPermission(@Body('permission') permission: string, @Body('id') id: number){
  //   return this.rolesService.insertPermission(id, permission);
  // }

  // @Patch(':id/permissions')
  // removePermission(@Body('permission') permission: string, @Body('id') id: number){
  //   return this.rolesService.removePermission(id, permission);
  // }
}
