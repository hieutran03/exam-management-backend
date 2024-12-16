import PermissionEnum from 'src/core/roles/permission.enum';
import {TeacherModel, TeacherModelData} from './teachers.model';
import { RoleWithPermissionBasedModel } from '../role/roleWithPermissionBased.model';
export interface TeachersWithDetailsModelData extends TeacherModelData{
  role_id: number;
  role_name: string;
  permissions: PermissionEnum[];
}

export  class TeachersWithDetailsModel extends TeacherModel {
  rolePermission: RoleWithPermissionBasedModel;
  constructor(data: TeachersWithDetailsModelData){
    super(data);
    this.rolePermission = new RoleWithPermissionBasedModel({
      id: data.role_id,
      name: data.role_name,
      permissions: data.permissions
    });
  }
  
}