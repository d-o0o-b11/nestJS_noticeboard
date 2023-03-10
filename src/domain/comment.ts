import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoticeBoardEntity } from './noticeboard';

@Entity('comment')
export class commentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  content: string;

  @CreateDateColumn()
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  //test
  date: Date;

  @ManyToOne(() => NoticeBoardEntity, (c) => c.comment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board_id' })
  noticeBoard: NoticeBoardEntity;

  @Column({ name: 'board_id' })
  board_id: number;
}
