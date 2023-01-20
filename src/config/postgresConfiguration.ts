import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseType } from 'typeorm';
import { IsDatabaseConfig } from './postgres.config.interface';

// // process.env memory (1)
// {
//     DB_USERNAME:"USERNAME"
// }

// // ConfigModule (memory) (2)
// {
//     postgres: {
//         // type: 'postgres' as DatabaseType,
//         // host: process.env.DB_HOST,
//         // port: Number(process.env.DB_PORT),
//         // username: process.env.DB_USERNAME,
//         // password: process.env.DB_PASSWORD,
//         ㅅㄷㄴㅅ : test
//     }
// }

export default registerAs('postgres', () => {
  const schema = Joi.object<IsDatabaseConfig, true>({
    // type: Joi.strig().required(),
    host: Joi.string().required(),
    port: Joi.number().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    database: Joi.string().required(),
  });

  const config = {
    type: 'postgres' as DatabaseType,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };

  const { error } = schema.validate(config, {
    abortEarly: false,
    // true :  첫번째 오류에서 유효성 검사 중지
    // false : 모든 오류 반환
  });

  console.log('error: ' + error);

  return config;
});
