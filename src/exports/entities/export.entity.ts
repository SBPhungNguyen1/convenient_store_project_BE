import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ExportDetail } from './export_detail.entity';

@Entity()
export class Export extends BaseEntity {
  @Column({ type: 'decimal' })
  total!: number;

  @Column({ type: 'varchar' })
  status!: string;

  @ManyToOne(() => User, (user) => user.exports)
  created_by!: User;

  @ManyToOne(() => User, (user) => user.boughts)
  buyer!: User;

  @OneToMany(() => ExportDetail, (exportEntity) => exportEntity.export)
  export_details!: ExportDetail[];
}
