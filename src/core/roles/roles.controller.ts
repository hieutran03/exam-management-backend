import { Body, Controller, Get, HttpCode, Param, Post, Put } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDTO } from "src/models/role/dtos/create-role.dto";
import { UpdateRoleDTO } from "src/models/role/dtos/update-role.dto";

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
    return this.rolesService.create(body);

  }

  @Put(':id')
  updateRole(@Param('id') id: number, @Body() body: UpdateRoleDTO){
    return this.rolesService.update(id, body);
  }

}
