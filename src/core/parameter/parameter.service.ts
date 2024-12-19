import { Injectable } from '@nestjs/common';
import ParameterRepository from './parameter.repository';

@Injectable()
export class ParameterService {
  constructor(private readonly parameterRepository: ParameterRepository) {}

  async getAll() {
    return await this.parameterRepository.getAll().catch((error) => {
      throw error;
    });
  }

  async getById(id: number) {
    return await this.parameterRepository.getById(id).catch((error) => {
      throw error;
    });
  }

  async getByName(name: string) {
    return await this.parameterRepository.getByName(name).catch((error) => {
      throw error;
    });
  }

  async update(id: number, value: string) {
    return await this.parameterRepository.update(id, value).catch((error) => {
      throw error;
    });
  }

  async updateByName(name: string, value: string) {
    return await this.parameterRepository.updateByName(name, value).catch((error) => {
      throw error;
    });
  }
}
