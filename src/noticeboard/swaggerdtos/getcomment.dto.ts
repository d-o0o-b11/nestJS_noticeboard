import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class GetCommentRes {
  @IsNumber()
  @ApiPropertyOptional({
    description: '댓글 번호',
    example: 1,
  })
  id: number;

  @IsString()
  @ApiPropertyOptional({
    description: '댓글 내용',
    example: '뚱이 친구 스폰지밥',
  })
  content: string;

  @IsDate()
  @ApiPropertyOptional({
    description: '댓글 작성 날짜',
    example: '2023-01-25T07:51:36.379Z',
  })
  date: Date;

  @IsNumber()
  @ApiPropertyOptional({
    description: '게시글 번호',
    example: 1,
  })
  board_id: number;
}
