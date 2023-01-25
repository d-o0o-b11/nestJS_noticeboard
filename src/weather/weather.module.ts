import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherEntity } from 'src/domain/weather';
import { NoticeBoardEntity } from 'src/domain/noticeboard';
import { NoticeboardService } from 'src/noticeboard/noticeboard.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([WeatherEntity])],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService, TypeOrmModule],
})
export class WeatherModule {}
