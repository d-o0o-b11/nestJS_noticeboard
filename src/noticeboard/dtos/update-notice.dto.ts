import { IsOptional, IsString } from 'class-validator';

export class UpdateBoardDTO {
  @IsString()
  @IsOptional()
  title?: string | undefined;

  @IsString()
  @IsOptional()
  content?: string | undefined;
}
