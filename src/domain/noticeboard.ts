import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { commentEntity } from './comment';

@Entity('noticeboard')
export class NoticeBoardEntity {
  //자동증가
  @PrimaryGeneratedColumn()
  id: number;

  //title 30글자
  @Column({ type: 'varchar', length: 30 })
  title: string;

  //content 200글자
  @Column({ type: 'varchar', length: 200 })
  content: string;

  //작성한 날짜
  @CreateDateColumn()
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  //조회수
  @Column('int', { default: 0 })
  view: number;

  @OneToMany(() => commentEntity, (n) => n.noticeBoard)
  comment: commentEntity[];
}
