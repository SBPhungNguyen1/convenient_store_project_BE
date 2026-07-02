import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Import } from './import.entity';
import { Product } from 'src/products/entities/product.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('import_details')
export class ImportDetail extends BaseEntity {
  @ManyToOne(() => Product, (product) => product.import_details)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @ManyToOne(() => Import, (importEntity) => importEntity.import_details)
  @JoinColumn({ name: 'import_id' })
  import!: Import;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal' })
  price!: number;
}
