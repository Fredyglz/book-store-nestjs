import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigService } from '../../config/config.service';
import { Configuration } from '../../config/config.keys';
import { ConfigModule } from '../../config/config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthRepository]),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory (config: ConfigService){
        return {
          secret: config.get(Configuration.JWT_SECRET),
          signOptions: {
            expiresIn: 3600,
          }
        }
      },
      inject: [ConfigService]
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    ConfigService,
    JwtStrategy
  ],
  exports: [
    JwtStrategy,
    PassportModule
  ]
})
export class AuthModule {}
