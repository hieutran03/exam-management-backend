import { Injectable } from '@nestjs/common';
import PermissionEnum from './permission.enum';
import RolesRepository from './roles.repository';

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

  async create(name: string, permissions: PermissionEnum[]) {
    const role = await this.rolesRepository.create(name);
    permissions.forEach(async (permission) => {
      await this.insertPermission(role.id, permission);
    });
    return role;
  }

  async update(id: number, name: string) {
    return this.rolesRepository.update(id, name);
  }

  async insertPermission(roleId: number, permissionName: PermissionEnum) {
    return this.rolesRepository.insertPermission(roleId, permissionName);
  }

  async removePermission(roleId: number, permissionName: PermissionEnum) {
    return this.rolesRepository.deletePermission(roleId, permissionName);
  }
}
