import {
  Column,
  CreateDateColumn,
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

  @CreateDateColumn()
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'varchar', length: 20 })
  Temperatures: string;

  @OneToOne(() => NoticeBoardEntity)
  @JoinColumn({ name: 'board_id' })
  noticeBoard: NoticeBoardEntity;

  @Column({ name: 'board_id' })
  board_id: number;
}
