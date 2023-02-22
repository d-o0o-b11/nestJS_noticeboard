import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateUtil } from '../utils/date.util';
import { NoticeBoardEntity } from 'src/domain/noticeboard';
import { WeatherService } from 'src/weather/weather.service';
import { Repository } from 'typeorm';
import { CreateNoticeDto } from './dtos/create-notice.dto';
import { UpdateBoardDTO } from './dtos/update-notice.dto';
import { CreateNoticeBoardDto } from './swaggerdtos/createnoticeboardto.dto';
import { CacheDBService } from 'src/redis/cache.service';
import { Cache } from 'cache-manager';
// import { NoticeRepository } from './noticeboard.repository';

@Injectable()
/**
 * @Injectable == Provider
 * 프로바이더, 공급자는 module 에서 import, export 되는 대상 클래스다.
 */
export class NoticeboardService {
  constructor(
    @InjectRepository(NoticeBoardEntity)
    private repository: Repository<NoticeBoardEntity>,
    private weatherService: WeatherService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // private cacheManager2: CacheDBService,
  ) {}

  /**
   * @name 게시글_저장
   * @param data NoticeBoardDTO
   * - data 를 받아서 Insert 쿼리를 실행해서 저장하자, 테이블에
   */
  async createNotice(data: CreateNoticeDto): Promise<CreateNoticeBoardDto> {
    // 어떻게 해서 저장을하자.
    // repository 를 가져와서 save 를 호출하자.
    // return this.repository.save();
    const entity: NoticeBoardEntity = new NoticeBoardEntity();
    entity.title = data.title; // 1.title -> une
    entity.content = data.content; // 1.content  udne

    const saveResult = await this.repository.save(entity); // {title: unde, content: unde}
    const formatdate = DateUtil.dateForamtter(saveResult.date);

    const weatherdata = await this.weatherService.getWeather2(
      saveResult.id,
      formatdate,
    );

    /**
     * 디비 작업이 오래 걸리는 이유
     * 1. database connection pool 을 연다
     * 2. 안에 연결된 데이터베이스 커넥션이 있는지 본다
     * 3. 없으면 데이터베이스랑 TCP/IP 통신해서 커넥션 만든다
     * 4. 연결 잘 되면 생성 요청 보낸다.
     */

    return {
      ...saveResult,
      weatherdata,
    };

    // return this.repository.save(entity);

    // 1. 게시글 저장
    // this.create(...)
    // 2. 댓글 저장
    // this.replyService.create(...)
    // 3. 유저의 게시글 작성 횟수 증가 (업데이트)
    // this.userService.updateEditCount();
    // return null;
  }

  /**
   * 게시글 목록 조회 API
   * @returns NoticeBoardDto[]
   */
  async findNotice() {
    const selectNotice = await this.repository.find({
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

    // setTimeout -> 1000 ms (평균) 100 ~ 200

    // return selectNotice.weather?.Temperatures;

    // const dto = NoticeBoardDto.from(selectNotice);

    // return dto;

    // controller - entity -> servcie - entity -> repository -> entity -> service - entity -> controller

    return selectNotice.map((entity) => ({
      id: entity.id,
      title: entity.title,
      content: entity.content,
      date: entity.date,
      view: entity.view,
      comment: entity.comment,
      temperature: entity?.weather?.Temperatures,
    }));
  }

  async detailNotice(id) {
    const value = await this.cacheManager.get<string>(`/noticeboard/${id}`);
    console.log('value', value);
    if (value) {
      console.log('caching');
      return JSON.parse(value);
    }

    await this.repository.update(id, {
      view: () => 'view + 1',
    });

    // console.log(value);

    if (!value) {
      const result = await this.repository.findOne({
        where: {
          id: id,
        },
        relations: {
          comment: true,
          weather: true,
        },
      });
      // console.log(result);

      //		set('cache 키', 'cache 값', 만료시간(sec))
      console.log('db');

      await this.cacheManager.set(
        `/noticeboard/${id}`,
        JSON.stringify(result),
        60 * 60,
      );
      // console.log('test', await this.cacheManager.get(id + ''));

      return result;
    }

    // await this.repository.update(id, {
    //   view: () => 'view + 1',
    // });

    // return this.repository.findOne({
    //   where: {
    //     id: id,
    //   },
    //   relations: {
    //     comment: true,
    //     weather: true,
    //   },
    // });
  }

  async updateNotice(id: number, data: UpdateBoardDTO) {
    // const { title, content } = data;
    // creteria -> PK 인줄 알아요

    // if (!id) {
    //   throw new HttpException({
    //     message: 'id 존재하지 않습니다.',
    //   });
    // }

    /**
     * {title, content}
     */
    const value = await this.cacheManager.get(`/noticeboard/${id}`);

    const updateResult = await this.repository.update(id, {
      ...data,
      date: new Date(Date.now()),
    });

    return updateResult;
  }

  async deleteNotice(id: number) {
    // 복수 삭제가 가능해야한다.
    const entity = await this.repository.findOne({
      where: {
        id: id,
      },
    });

    // // 없으면 Error 반환
    if (!entity) {
      throw Error('not found');
    }

    // 중요하다

    /**
     * DELETE FROM notcieboard where id = ?
     */
    return this.repository.delete(id);
  }

  // async findAll() {
  //   return this.noticeRepository
  // }
}
