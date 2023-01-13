import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { identity } from 'rxjs';
import { NoticeBoardEntity } from 'src/domain/noticeboard';
import { TestRealEntity } from 'src/test.entity';
import { Like, Repository } from 'typeorm';
import { View } from 'typeorm/schema-builder/view/View';
import { NoticeBoardDTO, UpdateNoticeBoardDTO } from './noticeboard.dto';
import { NoticeboardModule } from './noticeboard.module';
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
  ) {}

  /**
   * @name 게시글_저장
   * @param data NoticeBoardDTO
   * - data 를 받아서 Insert 쿼리를 실행해서 저장하자, 테이블에
   */
  async createNotice(data: NoticeBoardDTO) {
    // 어떻게 해서 저장을하자.
    // repository 를 가져와서 save 를 호출하자.
    // return this.repository.save();
    const entity: NoticeBoardEntity = new NoticeBoardEntity();
    entity.title = data.title;
    entity.content = data.content;
    // entity.date = data.date;

    return this.repository.save(entity);

    // 1. 게시글 저장
    // this.create(...)
    // 2. 댓글 저장
    // this.replyService.create(...)
    // 3. 유저의 게시글 작성 횟수 증가 (업데이트)
    // this.userService.updateEditCount();
    // return null;
  }

  async findNotice() {
    //includeText: string
    // return null;
    // return this.repository.find({
    //   where: {
    //     title: Like(includeText),
    //   },
    // });
    return this.repository.find({
      order: {
        id: 'ASC',
      },
      relations: {
        comment: true,
      },
    });
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
      },
    });
  }

  async updateNotice(id: number, data: UpdateNoticeBoardDTO) {
    // creteria -> PK 인줄 알아요

    // if (!id) {
    //   throw new HttpException({
    //     message: 'id 존재하지 않습니다.',
    //   });
    // }
    return this.repository.update(id, data);
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
