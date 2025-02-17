export interface TeacherModelData{
  id: number;
  name: string;
  username: string;
  password: string;
  role_id: number;
  role_name: string;
  created_at: string;
  deleted: boolean;
}
export class TeacherModel {
  constructor(data: TeacherModelData){
    this.id = data.id;
    this.name = data.name;
    this.username = data.username;
    this.password = data.password;
    this.role_id = data.role_id;
    this.role_name = data.role_name;
    this.created_at = data.created_at;
    this.deleted = data.deleted;
  }
  id: number;
  name: string;
  username: string;
  password: string;
  role_id: number;
  role_name: string;
  created_at: string;
  deleted: boolean;
}
 
