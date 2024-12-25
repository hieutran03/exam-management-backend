import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { ParameterService } from "./parameter.service";

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

  @Put(':id')
  async updateParameterById(@Param('id')id: number, @Body('value')value: number) {
    return await this.parameterService.update(id, value).catch((error) => {
      throw error;
    });
  }
}