import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { networkInterfaces } from 'os';
import { identity } from 'rxjs';
import { DateUtil } from '../utils/date.util';
import { commentEntity } from 'src/domain/comment';
import { NoticeBoardEntity } from 'src/domain/noticeboard';
import { TestRealEntity } from 'src/test.entity';
import { WeatherService } from 'src/weather/weather.service';
import { Like, Repository } from 'typeorm';
import { View } from 'typeorm/schema-builder/view/View';
import { CreateNoticeDto } from './dtos/create-notice.dto';
import { UpdateBoardDTO } from './dtos/update-notice.dto';
import { NoticeboardModule } from './noticeboard.module';
import { WeatherEntity } from 'src/domain/weather';
import { string } from 'joi';
import { NoticeBoardDto } from './dtos/notice-board.dto';
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
  ) {}

  /**
   * @name 게시글_저장
   * @param data NoticeBoardDTO
   * - data 를 받아서 Insert 쿼리를 실행해서 저장하자, 테이블에
   */
  async createNotice(data: CreateNoticeDto) {
    // 어떻게 해서 저장을하자.
    // repository 를 가져와서 save 를 호출하자.
    // return this.repository.save();
    const entity: NoticeBoardEntity = new NoticeBoardEntity();
    entity.title = data.title;
    entity.content = data.content;
    // const entity = data.toEntity();
    // entity.date = data.date;
    // console.log(
    //   '111:' +
    //     (await this.repository.save(entity)).date.toString().substring(1),
    // );

    const saveResult = await this.repository.save(entity);
    const formatdate = DateUtil.dateForamtter(saveResult.date);

    /**
     * 1. date-fns, moment(사용 안함 - 업데이트 중지) 같은 라이브러리 사용 (가장 일반적인 방법)
     *    moment(saveResult.date).format('yyyyMMDD'); -> 변환 완료
     * 2. private 혹은 util 클래스에 static method 로 dateFormatter 를 만드시는거
     */
    // wed Jan 25 2023 06:01:21 GMT+0000 -> yyyyMMDD

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
      saveResult,
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
    //includeText: string
    // return null;
    // return this.repository.find({
    //   where: {
    //     title: Like(includeText),
    //   },
    // });

    // deleteNotice, deleteComment, createWeather -> NoticeEntity ?? NoticeEntity 수정되면

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
    // findOne => entity찾ㄷ기
    // const noticeEntity = await this.repository.findOne({
    //   where: {
    //     id: id,
    //   },
    //   relations: {
    //     comment: true,
    //   },
    // });
    // await this.updateNotice(id, { view: noticeEntity.view + 1 });

    await this.repository.update(id, { view: () => 'view + 1' });

    return this.repository.findOne({
      where: {
        id: id,
      },
      relations: {
        comment: true,
        weather: true,
      },
    });
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

    return this.repository.update(id, {
      ...data,
      date: new Date(Date.now()),
    });
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
      throw Error('not foudn');
    }
    /**
     * DELETE FROM notcieboard where id = ?
     */
    return this.repository.delete(id);
  }

  // async findAll() {
  //   return this.noticeRepository
  // }
}
