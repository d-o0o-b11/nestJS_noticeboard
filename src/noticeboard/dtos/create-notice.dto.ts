import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { NoticeBoardEntity } from 'src/domain/noticeboard';

export class CreateNoticeDto {
  @IsString()
  @MaxLength(30)
  @ApiPropertyOptional({
    description: '게시글 제목 >> 30글자 내외',
    example: '뚱이 일기',
  })
  title: string;

  @IsString()
  @MaxLength(200)
  @ApiPropertyOptional({
    description: '게시글 내용 >> 200글자 내외',
    example: '뚱이는 밥먹었다',
  })
  content: string;

  date: Date;

  //   toEntity() {
  //     const entity = new NoticeBoardEntity();
  //     entity.title = this.title;
  //     entity.content = this.content;
  //     return entity;
  //   }
}
