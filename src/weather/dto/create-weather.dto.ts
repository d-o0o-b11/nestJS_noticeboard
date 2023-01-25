import { IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateWeatherDto {
  @IsString()
  @MaxLength(10)
  Temperatures: string;
}
