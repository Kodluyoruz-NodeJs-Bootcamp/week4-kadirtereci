import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

let dbConnectionInfo: any = {};

if (process.env.DATABASE_URL) {
  dbConnectionInfo.url = process.env.DATABASE_URL;
} else {
  dbConnectionInfo = {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
  };
}

export = {
  'type': 'postgres',
  ...dbConnectionInfo,
  'schema': process.env.DB_SCHEMA || 'public',
  'synchronize': false,
  'logging': false,
  'entities': ['dist/**/*.entity{.ts,.js}'],
  'migrations': ['src/migrations/**/*.{ts,js}'],
  'subscribers': ['src/subscriber/**/*.{ts,js}'],
  'cli': {
    'entitiesDir': 'src/entity',
    'migrationsDir': 'src/migrations',
    'subscribersDir': 'src/subscriber',
  },
  'namingStrategy': new SnakeNamingStrategy(),
};
