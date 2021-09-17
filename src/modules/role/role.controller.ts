import {
    Controller,
    Param,
    Get,
    Post,
    Body,
    Patch,
    Delete,
    ParseIntPipe,
  } from '@nestjs/common';
  import { RoleService } from './role.service';
  import { Role } from './role.entity';
  
  @Controller('roles')
  export class RoleController {
    constructor(private readonly _roleService: RoleService) {}
  
    @Get(':id')
    async getrole(@Param('id', ParseIntPipe) id: number): Promise<Role> {
      const role = await this._roleService.get(id);
      return role;
    }
  
    @Get()
    async getroles(): Promise<Role[]> {
      const roles = await this._roleService.getAll();
      return roles;
    }
  
    @Post('create')
    async createrole(@Body() role: Role): Promise<Role> {
      const createdrole = await this._roleService.create(role);
      return createdrole;
    }
  
    @Patch(':id')
    async updaterole(@Param('id', ParseIntPipe) id: number, @Body() role: Role) {
      await this._roleService.update(id, role);
      return true;
    }
  
    @Delete(':id')
    async deleterolerole(@Param('id', ParseIntPipe) id: number) {
      await this._roleService.delete(id);
      return true;
    }
  }
  