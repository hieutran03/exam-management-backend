import { Global, Module } from '@nestjs/common';
import DatabaseModule from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { RolesModule } from './roles/roles.module';
import { ParameterModule } from './parameter/parameter.module';
@Global()
@Module({
  
  imports: [
    AuthenticationModule, 
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        user: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
      }),
    }),
    RolesModule,
    ParameterModule,
  ],
  exports: [
    DatabaseModule,
    AuthenticationModule,
    RolesModule,
    ParameterModule,
  ],
})
export default class CoreModule {}