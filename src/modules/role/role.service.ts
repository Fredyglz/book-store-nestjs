import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from './role.repository';
import { Role } from './role.entity';
import { ReadRoleDto } from './dtos/read-role.dto';
import { plainToClass } from 'class-transformer';
import { CreateRoleDto } from './dtos';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async get(id: number): Promise<ReadRoleDto> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }

    const role: Role = await this._roleRepository.findOne(id, {
      where: { estatus: 'ACTIVE' },
    });

    if (!role) {
      throw new NotFoundException();
    }

    return plainToClass(ReadRoleDto, role);
  }

  async getAll(): Promise<ReadRoleDto[]> {
    const roles: Role[] = await this._roleRepository.find({
      where: { estatus: 'ACTIVE' },
    });

    return roles.map((role: Role) => plainToClass(ReadRoleDto, role));
  }

  async create(role: Partial<CreateRoleDto>): Promise<ReadRoleDto> {
    const savedRole: Role = await this._roleRepository.save(role);
    return plainToClass(ReadRoleDto, savedRole);
  }

  async update(
    roleId: number,
    role: Partial<UpdateRoleDto>,
  ): Promise<ReadRoleDto> {
    const foundRole = await this._roleRepository.findOne(roleId, {
        where: { estatus: 'ACTIVE'},
    });
    if (!foundRole) {
      throw new NotFoundException('This role does not exits');
    }
    foundRole.name = role.name;
    foundRole.description = role.description;
    const updateRole: Role = await this._roleRepository.save(foundRole);
    return plainToClass(ReadRoleDto, updateRole);
  }

  async delete(id: number): Promise<void> {
    const roleExists = await this._roleRepository.findOne(id, {
      where: { estatus: 'ACTIVE' },
    });
    if (!roleExists) {
      throw new NotFoundException();
    }
    await this._roleRepository.update(id, { estatus: 'INACTIVE' });
  }
}
