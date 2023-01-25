import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoticeBoardEntity } from './noticeboard';
@Entity('weather')
export class WeatherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  test: string;

  @OneToOne(() => NoticeBoardEntity)
  @JoinColumn({ name: 'board_id' })
  noticeBoard: NoticeBoardEntity;

  @Column({ name: 'board_id' })
  board_id: number;
}
