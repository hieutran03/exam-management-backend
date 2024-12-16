import { IsArray, IsString } from "class-validator";
import PermissionEnum from "src/core/roles/permission.enum";

export class CreateRoleDTO{
  @IsString()
  name: string;
  
  // @Transform(({value}) => value.map(element => {
  //   return PermissionEnum[element as keyof typeof PermissionEnum];
  // }))
  @IsArray()
  @IsString({each: true})
  permissions: PermissionEnum[];
}