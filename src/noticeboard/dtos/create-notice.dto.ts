import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { NoticeBoardEntity } from 'src/domain/noticeboard';

export class CreateNoticeDto {
  @IsString()
  @MaxLength(30)
  title: string;

  @IsString()
  @MaxLength(200)
  //   @IsOptional()
  //   @IsIn(['a', 'b'])
  content: string;

  date: Date;

  //   toEntity() {
  //     const entity = new NoticeBoardEntity();
  //     entity.title = this.title;
  //     entity.content = this.content;
  //     return entity;
  //   }
}
