import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WeatherEntity } from 'src/domain/weather';
import { Repository } from 'typeorm';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpService: HttpService;
  let repository: Repository<WeatherEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(WeatherEntity),
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    repository = module.get<Repository<WeatherEntity>>(
      getRepositoryToken(WeatherEntity),
    );
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(httpService).toBeDefined();
  });

  describe('날씨 api axios', () => {
    it('통신완료시 반환 값 확인', async () => {
      const url =
        'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?ServiceKey=';
      const result =
        url +
        process.env.WEATHER_KEY +
        `&pageNo=1&numOfRows=10&dataType=JSON&base_date=20230127&base_time=0600&nx=55&ny=127`;

      const dummy = {
        response: {
          header: {
            resultCode: '00',
            resultMsg: 'NORMAL_SERVICE',
          },
          body: {
            dataType: 'JSON',
            items: {
              item: [
                {
                  baseDate: '20230127',
                  baseTime: '0600',
                  category: 'PTY',
                  nx: 55,
                  ny: 127,
                  obsrValue: '0',
                },
                {
                  baseDate: '20230127',
                  baseTime: '0600',
                  category: 'REH',
                  nx: 55,
                  ny: 127,
                  obsrValue: '88',
                },
                {
                  baseDate: '20230127',
                  baseTime: '0600',
                  category: 'RN1',
                  nx: 55,
                  ny: 127,
                  obsrValue: '0',
                },
                {
                  baseDate: '20230127',
                  baseTime: '0600',
                  category: 'T1H',
                  nx: 55,
                  ny: 127,
                  obsrValue: '-13.5',
                },
                {
                  baseDate: '20230127',
                  baseTime: '0600',
                  category: 'UUU',
                  nx: 55,
                  ny: 127,
                  obsrValue: '0',
                },
                {
                  baseDate: '20230127',
                  baseTime: '0600',
                  category: 'VEC',
                  nx: 55,
                  ny: 127,
                  obsrValue: '0',
                },
                {
                  baseDate: '20230127',
                  baseTime: '0600',
                  category: 'VVV',
                  nx: 55,
                  ny: 127,
                  obsrValue: '0',
                },
                {
                  baseDate: '20230127',
                  baseTime: '0600',
                  category: 'WSD',
                  nx: 55,
                  ny: 127,
                  obsrValue: '0',
                },
              ],
            },
            pageNo: 1,
            numOfRows: 10,
            totalCount: 8,
          },
        },
      };
      const weatherId = 1;
      const date = 20230127;

      // const get = jest
      //   .spyOn(httpService, 'get')
      //   .mockImplementation(() => Promise.resolve(dummy));

      const get = jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(result));

      await service.getWeather2(weatherId, date);

      expect(get).toBeCalledWith(result);
      expect(get).toBeCalledTimes(1);
    });
  });
});
