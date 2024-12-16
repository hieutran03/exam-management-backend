import { Expose } from "class-transformer";
import PermissionEnum  from "../../../core/roles/permission.enum";

export class RolePermissionDTO{
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  permissions: PermissionEnum[];
}