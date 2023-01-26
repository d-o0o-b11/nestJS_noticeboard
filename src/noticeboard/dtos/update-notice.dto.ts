import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBoardDTO {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: '수정한 게시글 제목',
    example: '뚱이의 메모장',
  })
  title?: string | undefined;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: '수정한 게시글 내용',
    example: '날씨 맑음',
  })
  content?: string | undefined;
}
