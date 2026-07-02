import { Category } from 'src/categories/entities/category.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { ExportDetail } from 'src/exports/entities/export_detail.entity';
import { ImportDetail } from 'src/imports/entities/import_detail.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  description!: string;

  @Column({ type: 'decimal' })
  import_price!: number;

  @Column({ type: 'decimal' })
  export_price!: number;

  @Column({ type: 'varchar' })
  image!: string;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @OneToMany(() => ImportDetail, (importDetail) => importDetail.product)
  import_details!: ImportDetail[];

  @OneToMany(() => ExportDetail, (expDetail) => expDetail.product)
  export_details!: ExportDetail[];
}
