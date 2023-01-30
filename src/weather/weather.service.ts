import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { firstValueFrom, map, take, throwError } from 'rxjs';
import { WeatherEntity } from 'src/domain/weather';
import { Repository } from 'typeorm';
import weatherKeyConfig from '../config/weatherKeyConfig';
import configuration from '../config/weatherKeyConfig';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(WeatherEntity)
    @Inject(weatherKeyConfig.KEY)
    private repository: Repository<WeatherEntity>,
    private httpService: HttpService,
    private weatherKey: ConfigType<typeof weatherKeyConfig>,
  ) {}

  findAll() {
    return `This action returns all weather`;
  }

  async getWeather(result) {
    const weather = await axios.get(result);

    return weather.data;
  }

  async getWeather2(weahterId: number, date): Promise<string> {
    // 1) 여기 process.env -> 공공 API env 용 configuration + ConfigService 로 대체하기

    const url =
      'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?ServiceKey=';
    const result =
      url +
      process.env.WEATHER_KEY +
      `&pageNo=1&numOfRows=10&dataType=JSON&base_date=${date}&base_time=0600&nx=55&ny=127`;

    const weather = (
      await firstValueFrom<{ data }>(this.httpService.get(result))
    ).data;

    console.log('키값 확인: ');

    // const weatherResultObservable = this.httpService.get(result).t;

    // return weatherResultObservable.pipe(take(1)).subscribe({
    //   next: (data) => {
    //     console.log(data);
    //     return data;
    //   },
    //   error: (error) => throwError(() => error),
    //   complete: () => console.log('complete all'),
    // }) as any;

    // Promise 특정 작업의 상태 -> pending, reject, resolve 로 표현하는 객체
    // Observable 특정 작업의 스트림별 상태를 처리 -> 처리가 되는대로 계속 실제 값을 반환 -> subscribe
    // const weather = await axios.get(result);

    for (let i = 0; i < weather.response.body.totalCount; i++) {
      const result = weather.response.body.items.item[i];
      if (result.category == 'T1H') {
        const entity: WeatherEntity = new WeatherEntity();
        entity.board_id = weahterId;
        entity.Temperatures = result.obsrValue;

        await this.repository.save(entity);

        return result.obsrValue;
      }
    }

    // 1. Promise.all(), Promise.allSettled (병렬) <-- 일반적인 DB Access, Promise 반환시 모두 사용가능
    // 2. await for of (직렬) <-- 트랜잭션 관련시 요렇게 처리

    return weather.data.response.body.totalCount;
  }
}
