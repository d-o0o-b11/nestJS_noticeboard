import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { UpdateWeatherDto } from './dto/update-weather.dto';

@Injectable()
export class WeatherService {
  findAll() {
    return `This action returns all weather`;
  }

  async getWheather(result) {
    const weather = await axios.get(result);
    return weather.data;
  }
}
