import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ImportDetail } from './import_detail.entity';

@Entity()
export class Import extends BaseEntity {
  @Column({ type: 'decimal' })
  total!: number;

  @Column({ type: 'varchar' })
  status!: string;

  @ManyToOne(() => User, (user) => user.imports)
  @JoinColumn({ name: 'user_id' })
  created_by!: User;

  @OneToMany(() => ImportDetail, (importDetail) => importDetail.import)
  import_details!: ImportDetail[];
}
