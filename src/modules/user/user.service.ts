import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { RoleRepository } from '../role/role.repository';
import { status } from '../../shared/entity-status.enum';
import { ReadUserDto } from './dto/read-user.dto';
import { plainToClass } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly _userRepository: UserRepository,
        @InjectRepository(RoleRepository)
        private readonly _roleRepository: RoleRepository
    ) {}
    
    async get(id: number): Promise<ReadUserDto> {
        if(!id) {
            throw new BadRequestException("id must be sent")
        }

        const user: User = await this._userRepository.findOne(id, {where: {estatus: status.ACTIVE}})

        if(!user) {
            throw new NotFoundException();
        }

        return plainToClass(ReadUserDto, user);
    }
    
    async getAll(): Promise<ReadUserDto[]> {
        const users: User[] = await this._userRepository.find({where: {estatus: status.ACTIVE}})
        return users.map((user: User) => plainToClass(ReadUserDto, user));
    }

    async update(userId: number, user: UpdateUserDto): Promise<ReadUserDto> {
        const foundUser = await this._userRepository.findOne(userId, {
            where: { estatus: 'ACTIVE'}
        })
        if(!foundUser) {
            throw new NotFoundException('User does not exits')
        }

        foundUser.username = user.username
        const updateUser = this._userRepository.save(foundUser);
        return plainToClass(ReadUserDto, updateUser);
    }

    async delete(userId: number): Promise<void> {
        const userExist = await this._userRepository.findOne(userId, {
            where: {estatus: status.ACTIVE}
        });
        if(!userExist) {
            throw new NotFoundException();
        }
        await this._userRepository.update(userId, { estatus: 'INACTIVE' });
    }

    async setRoleToUser(userId: number, roleId: number): Promise<boolean> {
        const userExist = await this._userRepository.findOne(userId, {
            where: {estatus: status.ACTIVE}
        });
        if(!userExist) {
            throw new NotFoundException();
        }
        
        const roleExist = await this._roleRepository.findOne(roleId, {
            where: {estatus: status.ACTIVE}
        });
        if(!roleExist) {
            throw new NotFoundException('Role does not exist');
        }

        userExist.roles.push(roleExist);
        await this._userRepository.save(userExist);
        return true;
    }

}
