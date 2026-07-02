import { BaseEntity } from 'src/common/entities/base.entity';
import { Role } from 'src/common/enums/role.enum';
import { Export } from 'src/exports/entities/export.entity';
import { Import } from 'src/imports/entities/import.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role!: Role;

  @Column({ type: 'varchar', select: false })
  password!: string;

  // de luu refresh token
  @Column({ type: 'varchar', nullable: true })
  hashed_refresh_token?: string | null;

  @OneToMany(() => Import, (importEntity) => importEntity.created_by)
  imports!: Import[];

  @OneToMany(() => Export, (exportEntity) => exportEntity.created_by)
  exports!: Export[];

  @OneToMany(() => Export, (exportEntity) => exportEntity.buyer)
  boughts!: Export[];
}
