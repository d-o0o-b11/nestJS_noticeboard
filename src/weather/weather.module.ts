import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherEntity } from 'src/domain/weather';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([WeatherEntity]), HttpModule],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService, TypeOrmModule],
})
export class WeatherModule {}
