export interface RoleModelData{
  id: number;
  name: string;
}
export class RoleModel {
  constructor(data: RoleModelData){
    if(data.id === undefined || data.name === undefined){
      throw new Error('RoleModelData is not valid');
    }
    this.id = data.id;
    this.name = data.name;
  }
  id: number;
  name: string;
}