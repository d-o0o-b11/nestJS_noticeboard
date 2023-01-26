import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { GetCommentRes } from './getcomment.dto';

export class GetNoticeRes {
  @IsNumber()
  @ApiPropertyOptional({
    description: '게시글 번호',
    example: 1,
  })
  id: number;

  @IsString()
  @ApiPropertyOptional({
    description: '게시글 내용',
    example: '뚱이의 일기',
  })
  title: string;

  @IsString()
  @ApiPropertyOptional({
    description: '게시글 내용',
    example: '뚱이는 밥먹었다',
  })
  content: string;

  @IsDate()
  @ApiPropertyOptional({
    description: '게시글 생성날짜',
    example: '2023-01-25T07:51:36.379Z',
  })
  date: Date;

  @IsNumber()
  @ApiPropertyOptional({
    description: '게시글 조회수',
    example: 1,
  })
  view: number;

  @ApiPropertyOptional({
    type: () => GetCommentRes,
  })
  comment: GetCommentRes;
}
