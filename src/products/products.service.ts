import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { QueryProductDto } from './dto/query-product.dto';
import { ApiResponseDto } from 'src/common/interfaces/api-response.interface';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOneBy({
      id: createProductDto.category_id,
    });
    if (!category) throw new BadRequestException('Category not found');

    const item = this.productRepository.create({
      ...createProductDto,
      stock: 0,
      category,
    });

    await this.productRepository.save(item);

    return new ApiResponseDto(201, 'created', item);
    // return 'This action adds a new product';
  }

  async findAll(queryProductDto: QueryProductDto) {
    const page = queryProductDto.page;
    const limit = queryProductDto.limit;

    const qb = this.productRepository.createQueryBuilder('product');

    qb.leftJoinAndSelect('product.category', 'category');

    if (queryProductDto.name) {
      qb.andWhere('product.name ILIKE :name', {
        name: `%${queryProductDto.name}%`,
      });
    }

    if (queryProductDto.category_id) {
      qb.andWhere('product.category_id = :category_id', {
        category_id: queryProductDto.category_id,
      });
    }

    const [field, sort] = queryProductDto.sort.split('-');
    const allowedFields = ['created_at', 'name'];
    if (!allowedFields.includes(field))
      throw new BadRequestException('Invalid sort field');

    qb.orderBy(`product.${field}`, sort as 'ASC' | 'DESC');

    let items: any[];
    let total: number;

    if (limit === -1) {
      items = await qb.getMany();
      total = items.length;

      return new ApiResponseDto(200, 'success', {
        items,
        meta: {
          page: 1,
          limit: -1,
          total,
          total_pages: 1,
        },
      });
    }

    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const result = await qb.getManyAndCount();
    items = result[0];
    total = result[1];

    return new ApiResponseDto(200, 'success', {
      items,
      meta: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    });

    // return `This action returns all products`;
  }

  async findOne(id: string) {
    const item = await this.productRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!item) throw new BadRequestException('No product data');
    return new ApiResponseDto(200, 'success', item);
    // return `This action returns a #${id} product`;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const category = await this.categoryRepository.findOneBy({
      id: updateProductDto.category_id,
    });
    if (!category) throw new BadRequestException('Invalid category id');
    const item = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });
    return new ApiResponseDto(200, 'success', item);
  }

  async remove(id: string) {
    const item = await this.productRepository.softDelete(id);
    if (item.affected === 0) throw new NotFoundException('No product found');
    return new ApiResponseDto(200, 'success', 'Product deleted');
    // return `This action removes a #${id} product`;
  }
}
