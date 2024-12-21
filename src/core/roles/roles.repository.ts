import { RoleWithPermissionBasedModel } from "src/models/role/roleWithPermissionBased.model";
import DatabaseService from "../database/database.service";
import PermissionEnum from "./permission.enum";
import { Injectable, NotFoundException, Post } from "@nestjs/common";
import { RoleModel } from "src/models/role/role.model";
import { UpdateRoleDTO } from "src/models/role/dtos/update-role.dto";
import { PoolClient } from "pg";
import getDifferenceBetweenArrays from "src/utils/getDifferentBetweenArrays";
import PostgresErrorCode from "../database/postgresErrorCode.enum";
import { CreateRoleDTO } from "src/models/role/dtos/create-role.dto";

@Injectable()
export default class RolesRepository {
  constructor(private readonly databaseService: DatabaseService){}
  async get(){
    try {
      const databaseResponse = await this.databaseService.runQuery('select * from role');
      return databaseResponse.rows.map((role) => new RoleModel(role));
    } catch (error) {
      throw new Error('Error getting roles');
    }
    
  }
  async getById(id: number){
    try {
      const databaseResponse = await this.databaseService.runQuery('select * from role where id = $1', [id]);
      return new RoleModel(databaseResponse.rows[0]);
    } catch (error) {
      throw new Error('Error getting role by id');
    }
    
  }
  async getWithDetails(id: number){
    try {
      const roleResponse = await this.databaseService.runQuery(
        `select *
          from role
          where id = $1`, 
        [id]
      );
      const permissions = await this.getPermissions(id);
      return new RoleWithPermissionBasedModel({
        ...roleResponse.rows[0],
        permissions: permissions
      });
    } catch (error) {
      throw new Error('Error getting role with details');
    }
    
  }

  async getPermissions(id: number, client?: PoolClient){
    try {
      if(client){
        const databaseResponse = await client.query(
          `select array_to_json(array(
            select permission
            from permission_based
            where role_id = $1
            )) as permissions`,
          [id]
        );
        return databaseResponse.rows[0].permissions;
      }
      const databaseResponse = await this.databaseService.runQuery(
        `select array_to_json(array(
          select permission
          from permission_based
          where role_id = $1
          )) as permissions`,
        [id]
      );
      return databaseResponse.rows[0].permissions;
    } catch (error) {
      throw error;
    }
    
  }

  async create(roleData: CreateRoleDTO){
    const client = await this.databaseService.getPoolClient();
    try {
      await client.query('begin');
      const databaseResponse  = await client.query(
        `insert into
          role (name) 
          values ($1)
          returning *`, 
        [roleData.name]
      );
      const entity = databaseResponse.rows[0];
      if(!entity){
        throw new Error(`Role couldn't create`);
      }
      const newPermissions = roleData.permissions || [];
      const permissions = await this.updatePermissions(client, entity.id, newPermissions);
      await client.query('commit');
      return new RoleWithPermissionBasedModel({
        ...entity,
        permissions: permissions
      });
    } catch (error) {
      await client.query('rollback');
      throw new Error('Error creating role');
    } finally {
      client.release();
    }
    
  }
  async update(id: number, roleData: UpdateRoleDTO){
    const client = await this.databaseService.getPoolClient();
    try{
      await client.query('begin');
      const databaseResponse = await client.query(
        `update role
          set name = $1
          where id = $2
          returning *`,
        [roleData.name, id]
      );
      const entity = databaseResponse.rows[0];
      if(!entity){
        throw new NotFoundException(`Role with id ${id} not found`);
      }
      const newPermissions = roleData.permissions || [];
      const permissinons = await this.updatePermissions(client, id, newPermissions);
      await client.query('commit');
      return new RoleWithPermissionBasedModel({
        ...entity,
        permissions: permissinons
      });
    }catch(error){
      await client.query('rollback');
      throw new Error('Error updating role');
    }finally{
      client.release();
    }
    
  }
  async updatePermissions(client:PoolClient ,id: number, permissions: PermissionEnum[]){
    try {
      const currentPermissions = await this.getPermissions(id, client);

      const permissionsToInsert = getDifferenceBetweenArrays(
        permissions, 
        currentPermissions
      );
      
      const permissionsToDelete:PermissionEnum[] = getDifferenceBetweenArrays(
        currentPermissions,
        permissions
      );
      await this.insertPermission(
        client, 
        id, 
        permissionsToInsert);

      await this.deletePermission(
        client, 
        id, 
        permissionsToDelete
      );
      
      return await this.getPermissions(id, client);
    } catch (error) {
      throw new Error('Error updating permissions');
    } finally {

    }
    
  }
  async insertPermission(client: PoolClient,roleId: number, permissions: PermissionEnum[]){
    try {
      if(permissions.length === 0){
        return;
      }
      await client.query(
        `insert into permission_based (role_id, permission)
          select $1 as role_id, unnest($2::permission_name[]) as permission
          returning *`,
        [roleId, permissions]
      );
    } catch (error) {
      throw new Error('Error inserting permissions');
    }
  }
  async deletePermission(client: PoolClient, roleId: number, permissions: PermissionEnum[]){
    try {
      if(permissions.length === 0){
        return;
      }
      await client.query(
        `delete from permission_based
          where role_id = $1
          and permission = any($2::permission_name[])`,
        [roleId, permissions]
      );
    } catch (error) {
      throw new Error('Error deleting permissions');
    }
  }
}