import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ApiResponseDto } from 'src/common/interfaces/api-response.interface';
import { QueryCategoryDto } from './dto/query-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const item = this.categoryRepo.create(createCategoryDto);
    await this.categoryRepo.save(item);
    return new ApiResponseDto(201, 'created', item);
  }

  async findAll(queryCategoryDto: QueryCategoryDto) {
    const page = parseInt(queryCategoryDto.page);
    const limit = parseInt(queryCategoryDto.limit);

    const qb = this.categoryRepo.createQueryBuilder('category');

    if (queryCategoryDto.name)
      qb.andWhere('category.name ILIKE :name', {
        name: `%${queryCategoryDto.name}%`,
      });

    const [field, sort] = queryCategoryDto.sort.split('-');
    const allowedFields = ['name', 'created_at'];

    if (!allowedFields.includes(field))
      throw new BadRequestException('Invalid sort field');

    qb.orderBy(`category.${field}`, sort as 'ASC' | 'DESC');

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
  }

  async findOne(id: string) {
    const item = await this.categoryRepo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Data not found');
    }
    return new ApiResponseDto(200, 'success', item);
    // return `This action returns a #${id} category`;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // return `This action updates a #${id} category`;
    const item = await this.categoryRepo.preload({ id, ...updateCategoryDto });
    if (!item) throw new NotFoundException('No category data found');
    return new ApiResponseDto(200, 'success', item);
  }

  async remove(id: string) {
    const result = await this.categoryRepo.softDelete(id);
    if (result.affected === 0) throw new NotFoundException('Data not found');
    return new ApiResponseDto(200, 'User deleted successfully', null);
  }
}
