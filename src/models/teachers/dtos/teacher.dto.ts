import { Expose, Type } from "class-transformer";
import { RolePermissionDTO } from "src/models/role/dtos/rolePermission.dto";

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