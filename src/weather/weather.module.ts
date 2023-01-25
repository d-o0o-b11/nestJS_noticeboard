import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherEntity } from 'src/domain/weather';

@Module({
  imports: [TypeOrmModule.forFeature([WeatherEntity])],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
