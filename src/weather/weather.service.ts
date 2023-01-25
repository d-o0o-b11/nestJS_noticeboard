import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { UpdateWeatherDto } from './dto/update-weather.dto';

@Injectable()
export class WeatherService {
  private readonly DATA_URL =
    'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?ServiceKey=%2B25l0HaCzpLFeunH2w0VWm0RL1qSW4srfPAE8qcxt7espQzK9dUvIwumIKEXGZU9v2lEOkiC5BZPHttwjdo1%2FA%3D%3D&pageNo=1&numOfRows=10&base_date=20230123&base_time=0600&nx=55&ny=127';
  findAll() {
    return `This action returns all weather`;
  }

  async getWheather(result) {
    const weather = await axios.get(result);
    return weather.data;
  }
}
