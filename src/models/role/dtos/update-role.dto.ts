import { IsArray, IsOptional, IsString } from 'class-validator';
import PermissionEnum from 'src/core/roles/permission.enum';
export class UpdateRoleDTO {
  @IsString()
  name: string;
  @IsArray()
  permissions: PermissionEnum[];
}