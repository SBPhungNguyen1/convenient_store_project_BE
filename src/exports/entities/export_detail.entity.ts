import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Export } from './export.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity('export_details')
export class ExportDetail extends BaseEntity {
  @ManyToOne(() => Export, (exportEntity) => exportEntity.export_details)
  @JoinColumn({ name: 'export_id' })
  export!: Export;

  @ManyToOne(() => Product, (product) => product.export_details)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal' })
  price!: number;
}
