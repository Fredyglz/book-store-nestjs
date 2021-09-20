import { Expose, Type, Exclude } from 'class-transformer';
import { IsString } from "class-validator";
import { ReadUserDto } from '../../user/dto';

@Exclude()
export class LoggedInDto {
    @Expose()
    @IsString()
    token: string;

    @Expose()
    @Type(() => ReadUserDto) 
    user: ReadUserDto;
}