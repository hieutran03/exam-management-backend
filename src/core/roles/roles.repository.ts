import { RoleWithPermissionBasedModel } from "src/models/role/roleWithPermissionBased.model";
import DatabaseService from "../database/database.service";
import PermissionEnum from "./permission.enum";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class RolesRepository {
  constructor(private readonly databaseService: DatabaseService){}
  async get(){
    const databaseResponse = await this.databaseService.runQuery('select * from role');
    return databaseResponse.rows;
  }
  async getById(id: number){
    const databaseResponse = await this.databaseService.runQuery('select * from role where id = $1', [id]);
    return databaseResponse.rows[0];
  }
  async getWithDetails(id: number){
    const roleResponse = await this.databaseService.runQuery(
      `select *
        from role
        where id = $1`, 
      [id]
    );
    const permissionResponse = await this.databaseService.runQuery(
      `select array(
        select permissinon
        from permission_based
        where role_id = $1
      )`,
      [id]
    );
    return new RoleWithPermissionBasedModel({
      ...roleResponse.rows[0],
      permissions: permissionResponse.rows
    });
  }
  async create(name: string){
    const databaseResponse  = await this.databaseService.runQuery(
      `insert into
        role (name) 
        values ($1)
        returning *`, 
      [name]
    );
    return databaseResponse.rows[0];
  }
  async update(id: number, name: string){
    const databaseResponse = await this.databaseService.runQuery(
      `update role
        set name = $1
        where id = $2
        returning *`,
      [name, id]
    );
    return databaseResponse.rows[0];
  }

  async insertPermission(roleId: number, permissionName: PermissionEnum){
    const databaseResponse = await this.databaseService.runQuery(
      `insert into permission_based (role_id, permission)
        values ($1, $2)
        returning *`,
      [roleId, permissionName]
    );
    return databaseResponse.rows[0];
  }
  async deletePermission(roleId: number, permissionName: PermissionEnum){
    const databaseResponse = await this.databaseService.runQuery(
      `delete from permission_based
        where role_id = $1 and permission = $2
        returning *`,
      [roleId, permissionName]
    );
    return databaseResponse.rows[0];
  }
}