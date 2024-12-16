import PermissionEnum from "src/core/roles/permission.enum";
import { RoleModel, RoleModelData } from "./role.model";

export interface RoleWithPermissionBasedModelData extends RoleModelData{
  permissions: PermissionEnum[];
}

export class RoleWithPermissionBasedModel extends RoleModel {
  constructor(data: RoleWithPermissionBasedModelData){
    if(data.permissions === undefined){
      throw new Error('RoleWithPermissionBasedModelData is not valid');
    }
    super(data);
    this.permissions = data.permissions;
  }
  permissions: PermissionEnum[];
}