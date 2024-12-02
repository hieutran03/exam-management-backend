import type { Knex } from 'knex';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
 
config();
 
const configService = new ConfigService();
 
const knexConfig: Knex.Config = {
  client: 'postgresql',
  connection: {
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    user: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
  },
};
// npx knex migrate:make test_chill
// npx knex migrate:latest

module.exports = knexConfig;
