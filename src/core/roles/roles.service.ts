import { Injectable } from '@nestjs/common';
import RolesRepository from './roles.repository';
import { CreateRoleDTO } from 'src/models/role/dtos/create-role.dto';
import { UpdateRoleDTO } from 'src/models/role/dtos/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private rolesRepository: RolesRepository) {}

  async get() {
    return this.rolesRepository.get();
  }

  async getById(id: number) {
    return this.rolesRepository.getById(id);
  }

  async getWithDetails(id: number) {
    return this.rolesRepository.getWithDetails(id);
  }

  async create(roleData: CreateRoleDTO) {

    const role = await this.rolesRepository.create(roleData);
    
    return role;
  }

  async update(id: number, roleData: UpdateRoleDTO) {
    return this.rolesRepository.update(id, roleData);
  }

}
