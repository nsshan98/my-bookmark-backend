import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default (): PostgresConnectionOptions => ({
  url: process.env.DATABASE_URL,
  type: 'postgres',
  port: process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT, 10)
    : 3306,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
});
