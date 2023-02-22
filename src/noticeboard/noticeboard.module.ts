import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeBoardEntity } from 'src/domain/noticeboard';
import { WeatherModule } from 'src/weather/weather.module';
import { NoticeboardController } from './noticeboard.controller';
import { NoticeboardService } from './noticeboard.service';
// import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
// import * as redisCacheStore from 'cache-manager-ioredis';

@Module({
  /**
   * 기능 모듈에서는 반드시 관련된 엔터티만 forFeature 로 가져와야한다.
   */
  // imports: [TypeOrmModule.forFeature([NoticeBoardEntity, WeatherEntity])],
  imports: [
    WeatherModule,
    TypeOrmModule.forFeature([NoticeBoardEntity]),
    // RedisCacheModule,
    // CacheModule.register({
    //   useFactory: async () => ({
    //     isGlobal: true,
    //     store: redisStore,
    //     node: [{ host: 'dev_redis', port: 6379 }],
    //     options: { ttl: 0 },
    //   }),
    // }),
    //---------------------
    // CacheModule.registerAsync<any>({
    //   isGlobal: true,
    //   useFactory: async () => {
    //     const store = await redisStore({
    //       socket: { host: 'localhost', port: 6379 },
    //       ttl: 60,
    //     });
    //     return {
    //       store: () => store,
    //     };
    //   },
    // }),
    //---------------------
    // CacheModule.registerAsync({
    //   useFactory: async () => ({
    //     store: await redisStore({ ttl: 5000 }),
    //   }),
    // }),
    // --------------------
    // ConfigModule,
    // CacheModule.registerAsync<any>({
    //   isGlobal: true,
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => {
    //     const options = await configService.getRedisOptions();
    //     const store = await redisStore({
    //       socket: { host: options.host, port: options.port },
    //       ttl: 60,
    //     });
    //     return {
    //       store: () => store,
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
    // ---------됨
    // CacheModule.register({
    //   useFactory: async () => ({
    //     isGlobal: false,
    //     store: redisStore,
    //     node: [{ host: process.env.RESID_HOST, port: process.env.REDIS_PORT }],
    //     options: { ttl: 1000 * 60 },
    //   }),
    // }),

    //----------------
  ],

  controllers: [NoticeboardController],
  providers: [NoticeboardService],
})
export class NoticeboardModule {}
