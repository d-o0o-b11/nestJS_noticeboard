import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateNoticeBoardDto {
  @IsString()
  @MaxLength(30)
  @ApiPropertyOptional({
    description: '게시글 제목',
    example: '뚱이 일기',
  })
  title: string;

  @IsString()
  @MaxLength(200)
  @ApiPropertyOptional({
    description: '게시글 내용',
    example: '뚱이는 밥먹었다',
  })
  content: string;

  @IsNumber()
  @ApiPropertyOptional({
    description: '게시글 번호',
    example: 1,
  })
  id: number;

  @IsDate()
  @ApiPropertyOptional({
    description: '게시글 생성 날짜',
    example: '2023-01-26T01:30:55.747Z',
  })
  date: Date;

  @IsNumber()
  @ApiPropertyOptional({
    description: '게시글 조회수',
    example: 1,
  })
  view: number;

  @IsString()
  @ApiPropertyOptional({
    description: '게시글 생성했을 때 날씨온도',
    example: '-7.3',
  })
  weatherdata: string;
}
