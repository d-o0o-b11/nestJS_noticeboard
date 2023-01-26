import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString, MaxLength } from 'class-validator';
import { SaveResultDto } from '../dtos/save-result.dto';

export class CreateNoticeRes {
  @ApiProperty({
    type: () => SaveResultDto,
  })
  saveResult: SaveResultDto;

  @IsString()
  @ApiPropertyOptional({
    description: '게시글 생성했을 때 날씨온도',
    example: '-7.3',
  })
  weatherdata: string;
}
