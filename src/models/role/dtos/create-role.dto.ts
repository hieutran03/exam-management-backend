import { IsArray, IsOptional, IsString } from "class-validator";
import PermissionEnum from "src/core/roles/permission.enum";

export class CreateRoleDTO{
  @IsString()
  name: string;
  @IsArray()
  @IsOptional()
  permissions: PermissionEnum[];
}