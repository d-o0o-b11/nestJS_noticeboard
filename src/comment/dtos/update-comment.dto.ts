import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @ApiPropertyOptional({
    description: '수정한 댓글 내용',
    example: '집게리아',
  })
  @IsString()
  @MaxLength(50)
  content?: string;
}
