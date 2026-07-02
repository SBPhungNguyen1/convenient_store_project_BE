import { BaseEntity } from 'src/common/entities/base.entity';
import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  description!: string;

  @OneToMany(() => Product, (product) => product.category)
  products!: Product[];
}
