import { RoleModel, RoleModelData } from "./role.model";

export interface RoleWithPermissionBasedIdsModelData extends RoleModelData{
  permissions: string[];
}

export class RoleWithPermissionBasedIdsModel extends RoleModel {
  constructor(data: RoleWithPermissionBasedIdsModelData){
    super(data);
    this.permissions = data.permissions;
  }
  permissions: string[];
}