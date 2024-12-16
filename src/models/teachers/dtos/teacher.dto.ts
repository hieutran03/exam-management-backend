import { Exclude, Expose, Type } from "class-transformer";
import { RolePermissionDTO } from "src/models/role/dtos/rolePermission.dto";
import { RoleWithPermissionBasedModel } from "src/models/role/roleWithPermissionBased.model";

export class TeacherDTO{
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  username: string;
  @Expose()
  role_id: number;
  @Expose()
  @Type(() => RolePermissionDTO)
  rolePermission: RolePermissionDTO;
}