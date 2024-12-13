export interface RoleModelData{
  id: number;
  name: string;
  created_at: string;
  deleted: boolean;
}
export class RoleModel {
  constructor(data: RoleModelData){
    this.id = data.id;
    this.name = data.name;
    this.created_at = data.created_at;
    this.deleted = data.deleted;
  }
  id: number;
  name: string;
  created_at: string;
  deleted: boolean;
}