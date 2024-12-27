import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common";
import { ParameterService } from "./parameter.service";
import PermissionGuard from "../roles/permission.guard";
import PermissionEnum from "../roles/permission.enum";

@Controller('parameter')
export class ParameterController {
  constructor(private readonly parameterService: ParameterService) {}
  
  @Get()
  async getAllParameters() {
    return await this.parameterService.getAll().catch((error) => {
      throw error;
    });
  }

  // @Get(':id')
  // async getParameterById(id: number) {
  //   return await this.parameterService.getById(id).catch((error) => {
  //     throw error;
  //   });
  // }

  @UseGuards(PermissionGuard(PermissionEnum.TEACHER_MODIFY))
  @Put(':id')
  async updateParameterById(@Param('id')id: number, @Body('value')value: number) {
    return await this.parameterService.update(id, value).catch((error) => {
      throw error;
    });
  }
}