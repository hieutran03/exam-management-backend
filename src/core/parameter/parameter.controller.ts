import { Controller, Get, Post } from "@nestjs/common";
import { ParameterService } from "./parameter.service";
import { error } from "console";

@Controller('parameter')
export class ParameterController {
  constructor(private readonly parameterService: ParameterService) {}
  
  @Get()
  async getAllParameters() {
    return await this.parameterService.getAll().catch((error) => {
      throw error;
    });
  }

  @Post(':id')
  async getParameterById(id: number) {
    return await this.parameterService.getById(id).catch((error) => {
      throw error;
    });
  }
}