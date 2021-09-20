import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../role/roletype.enum';
import { ReadUserDto, UpdateUserDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get(':userId')
  // @Roles(RoleType.ADMINISTRATOR)
  // @UseGuards(AuthGuard(), RoleGuard)
  getUser(@Param('userId', ParseIntPipe) userId: number): Promise<ReadUserDto> {
    return this._userService.get(userId);
  }

  // @UseGuards(AuthGuard())
  @Get()
  getUsers(): Promise<ReadUserDto[]> {
    return this._userService.getAll();
  }

  @Patch(':userId')
  updateUser(@Param('userId', ParseIntPipe) userId: number, @Body() user: UpdateUserDto) {
    return this._userService.update(userId, user);
  }

  @Delete(':userId')
  deleteUserUser(@Param('userId', ParseIntPipe) userId: number): Promise<void> {
    return this._userService.delete(userId);
  }

  @Post('setRole/:userId/:roleId')
  setRoleToUser(
    @Param('userId') userId: number,
    @Param('roleId') roleId: number
  ): Promise<boolean> {
    return this._userService.setRoleToUser(userId, roleId);
  }
}
