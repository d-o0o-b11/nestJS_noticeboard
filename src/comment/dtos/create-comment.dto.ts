import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MaxLength(50)
  @ApiPropertyOptional({
    description: '댓글 내용',
    example: '게살버거 맛남',
  })
  content: string;
}
