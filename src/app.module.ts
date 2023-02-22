import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoticeboardModule } from './noticeboard/noticeboard.module';
import { NoticeBoardEntity } from './domain/noticeboard';
import { CommentModule } from './comment/comment.module';
import { commentEntity } from './domain/comment';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WeatherModule } from './weather/weather.module';
import databaseConfiguration from './config/postgresConfiguration';
import { WeatherEntity } from './domain/weather';
import weatherKeyConfig from './config/weatherKeyConfig';
import { redisStore } from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
// import { redisStore } from 'cache-manager-redis-yet';
@Module({
  imports: [
    // 서버가 켜지기전 언젠가 수행이 됩니다!
    ConfigModule.forRoot({
      envFilePath: [
        'src/envs/development.env',
        'src/envs/weatherkey.env',
        'src/envs/redis.env',
      ], // 폴더 루트 기준 절대 경로
      load: [databaseConfiguration, weatherKeyConfig],
      isGlobal: true,
    }),

    CacheModule.register({
      useFactory: () => ({
        isGlobal: true,
        store: redisStore,
        node: [{ host: process.env.RESID_HOST, port: process.env.REDIS_PORT }],
        options: { ttl: 100000 },
      }),
    }),

    // CacheModule.register<RedisClientOptions>({
    //   // Store-specific configuration:
    //   host: process.env.RESID_HOST,
    //   port: +process.env.REDIS_PORT,
    // }),

    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DB_HOST,
    //   port: Number(process.env.DB_PORT),
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_DATABASE,
    //   entities: [NoticeBoardEntity, commentEntity],
    //   synchronize: false,
    // }),

    // 동적 모듈 -> useFactory
    /**
     * static func = (option) =>  new ConfigModule(option);
     * static me = new ConfigModule('tkd')
     */
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          load: [weatherKeyConfig],
        }),
      ],
      /**
       * constructor(
       *  @Inject() configService: ConfigService
       * )
       */
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          ...configService.get('postgres'),
          entities: [NoticeBoardEntity, commentEntity, WeatherEntity],
          synchronize: true,
        };
      },
    }),
    NoticeboardModule,
    CommentModule,
    WeatherModule,

    /**
     * 반려동물 가장 많은 미용샵으로 -> (우리샵으로) 목록 조회 할때
     * 캐싱 안한 거 1회 2회 3회    -> API 반환 시간을 측정
     * 캐싱 한거 1회 2회 3회      -> API 반환 시간을 측정
     */
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          store: (await redisStore({
            socket: {
              host: process.env.RESID_HOST,
              port: +process.env.REDIS_PORT,
            },
          })) as unknown as CacheStore,
          ttl: 60 * 60 * 24 * 7, // 1 week
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
