import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeBoardEntity } from 'src/domain/noticeboard';
import { WeatherEntity } from 'src/domain/weather';
import { WeatherModule } from 'src/weather/weather.module';
import { WeatherService } from 'src/weather/weather.service';
import { NoticeboardController } from './noticeboard.controller';
import { NoticeboardService } from './noticeboard.service';
import * as redisStore from 'cache-manager-redis-store';
import { RedisCacheModule } from 'src/redis/cache.module';
import type { RedisClientOptions } from 'redis';

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
    CacheModule.register<RedisClientOptions>({
      // isGlobal: true,
      store: redisStore,
      // node: [{ host: 'dev_redis', port: 6379 }],
      // options: { ttl: 0 },
      host: 'dev_redis',
      port: 6379,
      // useFactory: async () => ({
      //   isGlobal: true,
      //   store: redisStore,
      //   node: [{ host: 'dev_redis', port: 6379 }],
      //   options: { ttl: 0 },
      // }),
    }),
  ],
  controllers: [NoticeboardController],
  providers: [NoticeboardService],
})
export class NoticeboardModule {}
