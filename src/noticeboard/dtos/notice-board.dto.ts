import { commentEntity } from 'src/domain/comment';
import { NoticeBoardEntity } from 'src/domain/noticeboard';

export class NoticeBoardDto {
  id: number;

  title: string;

  content: string;

  date: Date;

  view: number;

  comment: commentEntity[];

  temperature: string;

  constructor(data: Partial<NoticeBoardDto>) {
    Object.assign(this, data);
  }

  static from(entityList: NoticeBoardEntity[]) {
    return entityList.map(
      (entity) =>
        new NoticeBoardDto({
          id: entity.id,
          title: entity.title,
          content: entity.content,
          date: entity.date,
          view: entity.view,
          comment: entity.comment,
          temperature: entity?.weather.Temperatures,
        }),
    );
  }
}
