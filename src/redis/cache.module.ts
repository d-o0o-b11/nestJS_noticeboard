import { CacheModule, Global, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { CacheDBService } from './cache.service';

// export const cacheModule = CacheModule.registerAsync({
//   useFactory: async () => ({
//     store: redisStore,
//     host: 'localhost',
//     port: '6379',
//     ttl: 0,
//     auth_pass: 'password',
//   }),
// });

// @Global()
// @Module({
//   imports: [cacheModule],
//   providers: [CacheDBService],
//   exports: [CacheDBService],
// })
// export class CacheDBModule {}

const cacheModule = CacheModule.register({
  useFactory: async () => ({
    store: redisStore,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    ttl: 0,
  }),
});

@Module({
  imports: [cacheModule],
  exports: [cacheModule],
})
export class RedisCacheModule {}
