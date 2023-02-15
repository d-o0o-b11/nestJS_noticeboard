import { CacheModule, Module } from '@nestjs/common';
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
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    // 서버가 켜지기전 언젠가 수행이 됩니다!
    ConfigModule.forRoot({
      envFilePath: ['src/envs/development.env', 'src/envs/weatherkey.env'], // 폴더 루트 기준 절대 경로
      load: [databaseConfiguration, weatherKeyConfig],
      isGlobal: true,
    }),

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
