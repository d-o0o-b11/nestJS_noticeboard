import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { WeatherEntity } from 'src/domain/weather';
import { Repository } from 'typeorm';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(WeatherEntity)
    private repository: Repository<WeatherEntity>,
  ) {}

  findAll() {
    return `This action returns all weather`;
  }

  async getWeather(result) {
    const weather = await axios.get(result);

    return weather.data;
  }

  async getWeather2(weahterId: number, date) {
    const url =
      'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?ServiceKey=';
    const result =
      url +
      process.env.WEATHER_KEY +
      `&pageNo=1&numOfRows=10&dataType=JSON&base_date=${date}&base_time=0600&nx=55&ny=127`;

    const weather = await axios.get(result);

    for (let i = 0; i < weather.data.response.body.totalCount; i++) {
      const result = weather.data.response.body.items.item[i];
      if (result.category == 'T1H') {
        const entity: WeatherEntity = new WeatherEntity();
        entity.board_id = weahterId;
        entity.Temperatures = result.obsrValue;

        await this.repository.save(entity);

        return result.obsrValue;
      }
    }

    // return weather.data.response.body.totalCount;
  }
}
