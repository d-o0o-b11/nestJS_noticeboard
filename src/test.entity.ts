import { Column, Entity, Generated, PrimaryColumn } from 'typeorm';

@Entity('test_real')
/**
 * Entity == Table (db)
 */
export class TestRealEntity {
  @PrimaryColumn('int')
  @Generated()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  content: string;
}
