import { DatabaseType } from 'typeorm';

export interface IsDatabaseConfig {
  type: DatabaseType;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}
