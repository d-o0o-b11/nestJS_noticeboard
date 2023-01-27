import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DateUtil } from 'src/\butils/date.util';

import { NoticeBoardEntity } from 'src/domain/noticeboard';
import { WeatherService } from 'src/weather/weather.service';
import { Repository } from 'typeorm';
import { CreateNoticeDto } from './dtos/create-notice.dto';
import { UpdateBoardDTO } from './dtos/update-notice.dto';
import { NoticeboardService } from './noticeboard.service';
import { CreateNoticeBoardDto } from './swaggerdtos/createnoticeboardto.dto';

describe('NoticeboardService', () => {
  let service: NoticeboardService;
  let repository: Repository<NoticeBoardEntity>;
  let weatherService: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoticeboardService,

        // repository 주입을 mocking
        {
          provide: getRepositoryToken(NoticeBoardEntity),
          useValue: {
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },

        // weatherService 주입을 mocking
        {
          provide: WeatherService,
          useValue: {
            getWeather2: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NoticeboardService>(NoticeboardService);
    repository = module.get<Repository<NoticeBoardEntity>>(
      getRepositoryToken(NoticeBoardEntity),
    );
    weatherService = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(weatherService).toBeDefined();
  });

  /**
   * 1. 테스트 할려는 함수에서 단위 테스트 로직을 점검할 함수를 고른다.
   * 2. 고른 점검 함수의 input, output 을 정의한다. (테스트 데이터로)
   * 3. spy 함수를 맨 위에 작성한다.
   * 4. 실제 테스트 할 함수를 호출한다(서비스 함수 호출)
   * 5. expect
   */

  it('게시글 저장 성공', async () => {
    const testCreateNoticeDto = new CreateNoticeDto();
    testCreateNoticeDto.title = 'testtest';
    testCreateNoticeDto.content = 'teststestsetsetset';

    // repository.save 의 정상 반환값
    const saveResult = {
      id: 11,
      title: 'aaaaa',
      content: 'cccc',
      date: new Date('2023-01-13T07:26:15.594Z'), // 날짜 표현하는 문자열 가능!
      view: 37,
      comment: [
        {
          id: 15,
          content: '33댓글',
          date: '2023-01-16T07:02:11.420Z',
          board_id: 11,
        },
        {
          id: 16,
          content: '33댓글',
          date: '2023-01-16T07:02:11.420Z',
          board_id: 11,
        },
      ],
    };
    const formatdate = DateUtil.dateForamtter(saveResult.date);

    // 1. repository.save 를 1회 NoticeBoardEntity 객체로 잘 호출하는가?
    /**
     * input  : CreateNoticeDto 에서 받아온 값으로 생성한 NoticeEntity 인스턴스
     * return : Save 메서드 호출 결과 (mocking 잘 댓다고 가정하고, 정상값 반환하도록 만듬)
     */
    const saveExecuteInfo = jest
      .spyOn(repository, 'save')
      .mockResolvedValue(saveResult as any);

    // 2. weatherservice.getWeather2 를 1회 saveResult 의 date 값으로 호출 햇는가?
    //string -> Date 형태로

    // weatherService.getWeather2 의 정상 반환값
    const weather = '-7.0';
    const getWeather2 = jest
      .spyOn(weatherService, 'getWeather2')
      .mockResolvedValue(weather);

    const result = await service.createNotice(testCreateNoticeDto);

    const entity: NoticeBoardEntity = new NoticeBoardEntity();
    entity.title = testCreateNoticeDto.title;
    entity.content = testCreateNoticeDto.content;
    expect(saveExecuteInfo).toBeCalledWith(entity); // repository 의 save 는 위처럼 구성한 entity 로 호출되어야해
    expect(saveExecuteInfo).toBeCalledTimes(1);

    // getWeather2 는 반드시 save 한 결과의 id 와 date 를 변환한 값으로 호출 되어야해
    expect(getWeather2).toBeCalledWith(saveResult.id, formatdate);
    // expect(getWeather2).toHaveBeenNthCalledWith(1, saveResult.id, formatdate);
    // expect(getWeather2).toHaveBeenNthCalledWith(2, saveResult.id, formatdate + 1day);
    expect(getWeather2).toBeCalledTimes(1);

    /**
     * save 한 결과랑, save 결과를 토대로 조회한 weather 를 잘 섞어서
     * 반환값을 만들어서 반환하는가? (최종으로 함수 끝!)
     */
    expect(result).toStrictEqual({
      ...saveResult,
      weatherdata: weather,
    });
  });

  describe('findNotice', () => {
    it('게시글 출력 성공', async () => {
      const selectNotice = [
        {
          id: 128,
          title: '00000',
          content: 'asdfa',
          date: '2023-01-26T01:30:55.747Z',
          view: 0,
          comment: [
            {
              id: 15,
              content: '33댓글',
              date: '2023-01-16T07:02:11.420Z',
              board_id: 11,
            },
            {
              id: 16,
              content: '33댓글',
              date: '2023-01-16T07:02:11.420Z',
              board_id: 11,
            },
          ],
          weather: {
            id: 9,
            date: '2023-01-26T01:31:02.894Z',
            Temperatures: '-7.3',
            board_id: 128,
          },
        },
      ];

      const expectedResult = [
        {
          id: 128,
          title: '00000',
          content: 'asdfa',
          date: '2023-01-26T01:30:55.747Z',
          view: 0,
          comment: [
            {
              id: 15,
              content: '33댓글',
              date: '2023-01-16T07:02:11.420Z',
              board_id: 11,
            },
            {
              id: 16,
              content: '33댓글',
              date: '2023-01-16T07:02:11.420Z',
              board_id: 11,
            },
          ],
          temperature: '-7.3',
        },
      ];

      const find = jest
        .spyOn(repository, 'find')
        .mockResolvedValue(selectNotice as any);

      /**
       * @NOTE 단위테스트는 describe, it 블록으로 나누어집니다.
       * it 블록은 하나의 단위 테스트 케이스 입니다.
       * describe 블록은 it 블록을 수행하기 위한 메타 데이터를 처리합니다.
       *
       * --> 중요 <-- it 블록 내에서 호출된 함수는 jest 가 스파잉, 목킹을 통해 실행 정보를 얻을 수 있습니다.
       */
      const result = await service.findNotice();

      expect(find).toBeCalledWith({
        order: {
          id: 'ASC', // noticeboard id
          comment: {
            id: 'ASC',
          },
        },
        relations: {
          comment: true,
          weather: true,
        },
      });
      expect(find).toBeCalledTimes(1);

      expect(result).toStrictEqual(expectedResult);
      // expect(result).toStrictEqual(
      //   selectNotice.map((entity) => ({
      //     id: entity.id,
      //     title: entity.title,
      //     content: entity.content,
      //     date: entity.date,
      //     view: entity.view,
      //     comment: entity.comment,
      //     temperature: entity?.weather?.Temperatures,
      //   })),
      // );
    });
  });

  describe('detailNotice', () => {
    const testId = 128;

    // it('게시글 조회수 증가 확인', async () => {
    //   const updateSpyFn = jest.spyOn(repository, 'update').mockResolvedValue({
    //     affected: 1,
    //     raw: 1,
    //     generatedMaps: [],
    //   }); // return undefiend

    //   await service.detailNotice(testId); // 요고는 빠져있엇지만 테스트코드의 99프로느 ㄴ작성 완료 하셧군요

    //   // 요기엔 무언가 들어가야합니다.

    //   expect(updateSpyFn).toBeCalledTimes(1);
    //   // expect(updateSpyFn).toBeCalledWith(testId, { view: () => 'view + 1' });
    // });

    it('개별 게시글 출력 확인', async () => {
      const result = {
        id: 128,
        title: '00000',
        content: 'asdfa',
        date: '2023-01-26T01:30:55.747Z',
        view: 1,
        comment: [],
        weather: {
          id: 9,
          date: '2023-01-26T01:31:02.894Z',
          Temperatures: '-7.3',
          board_id: 128,
        },
      };

      /**
       * await service.detailNotice(testId) 실행되는 순간,
       * repository.update 는 무조건 실행되요
       */
      // jest.spyOn(repository, 'update').mockResolvedValue({
      //   affected: 1,
      //   raw: 1,
      //   generatedMaps: [],
      // }); // return undefiend
      jest.spyOn(repository, 'update');

      const findOne = jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(result as any);

      await service.detailNotice(testId); // 요고는 빠져있엇지만 테스트코드의 99프로느 ㄴ작성 완료 하셧군요

      expect(findOne).toBeCalledTimes(1);
      expect(findOne).toBeCalledWith({
        where: {
          id: testId,
        },
        relations: {
          comment: true,
          weather: true,
        },
      });
    });
  });

  describe('updateNotice', () => {
    const testId = 128;
    const testUpdateNoticeDto = new UpdateBoardDTO();
    testUpdateNoticeDto.title = 'testtes';
    testUpdateNoticeDto.content = 'ccccc';

    const dummy = {
      generatedMaps: [],
      raw: [],
      affected: 1,
    };

    it('게시글 update', async () => {
      const updateResult = jest
        .spyOn(repository, 'update')
        .mockResolvedValue(dummy);

      await service.updateNotice(testId, testUpdateNoticeDto);

      expect(updateResult).toBeCalledTimes(1);
      expect(updateResult).toBeCalledWith(testId, {
        ...testUpdateNoticeDto,
        date: new Date(Date.now()),
      });
    });
  });

  describe('deleteNotice', () => {
    const testId = 25;
    const dummy = {
      id: 128,
      title: '00000',
      content: 'asdfa',
      date: '2023-01-26T01:30:55.747Z',
      view: 0,
      comment: [
        {
          id: 15,
          content: '33댓글',
          date: '2023-01-16T07:02:11.420Z',
          board_id: 11,
        },
        {
          id: 16,
          content: '33댓글',
          date: '2023-01-16T07:02:11.420Z',
          board_id: 11,
        },
      ],
      temperature: '-7.3',
    };

    it('entity 있을때 ', async () => {
      const findOneSpyFn = jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(dummy as any);

      await service.deleteNotice(testId);

      expect(findOneSpyFn).toBeCalledWith({
        where: {
          id: testId,
        },
      });
      expect(findOneSpyFn).toBeCalledTimes(1);
    });

    it('entity 없을때 ', async () => {
      const findOneSpyFn = jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(null);

      // await service.deleteNotice(testId);
      await expect(
        async () => await service.deleteNotice(testId),
      ).rejects.toThrowError('not found');
    });
  });
});
