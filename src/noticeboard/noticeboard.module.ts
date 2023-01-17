import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeBoardEntity } from 'src/domain/noticeboard';
import { NoticeboardController } from './noticeboard.controller';
import { NoticeboardService } from './noticeboard.service';

@Module({
  /**
   * 기능 모듈에서는 반드시 관련된 엔터티만 forFeature 로 가져와야한다.
   */
  imports: [TypeOrmModule.forFeature([NoticeBoardEntity])],
  controllers: [NoticeboardController],
  providers: [
    {
      provide: 'test',
      useClass: NoticeboardService,
    },
  ],
})
export class NoticeboardModule {}
