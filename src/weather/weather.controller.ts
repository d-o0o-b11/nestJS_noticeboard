import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { UpdateWeatherDto } from './dto/update-weather.dto';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  /**
   * http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst + ? +ServiceKey = +&pageNo= +
&numOfRows = + &base_date= + &base_time= + &nx= + &ny=
   */
  @Get()
  findOne() {
    const url =
      'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?ServiceKey=';
    const result =
      url +
      process.env.WEATHER_KEY +
      '&pageNo=1&numOfRows=10&dataType=JSON&base_date=20230125&base_time=0600&nx=55&ny=127';

    return this.weatherService.getWeather(result);
  }
}
