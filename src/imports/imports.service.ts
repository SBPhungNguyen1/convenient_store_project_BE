/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { CreateImportDto } from './dto/create-import.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Import } from './entities/import.entity';
import { ImportDetail } from './entities/import_detail.entity';
import { Status } from 'src/common/enums/status.enum';
import { ApiResponseDto } from 'src/common/interfaces/api-response.interface';
import { QueryImportDto } from './dto/query-import.dto';

@Injectable()
export class ImportsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Import)
    private readonly importRepo: Repository<Import>,

    @InjectRepository(ImportDetail)
    private readonly importDetailRepo: Repository<ImportDetail>,
  ) {}
  async create(createImportDto: CreateImportDto, @Req() req) {
    // 1 - Find user
    const user = await this.userRepo.findOneBy({
      email: req.user.email as string,
    });
    if (!user) throw new NotFoundException('No user found');

    // 2 - create import
    const importItem = this.importRepo.create({
      created_by: user,
      total: 0,
      status: Status.PENDING,
    });

    await this.importRepo.save(importItem);

    // 3 - import ==> check >> create_import_detail >> +stock >> +total
    let total = 0;
    for (const item of createImportDto.items) {
      // product
      const product = await this.productRepo.findOneBy({ id: item.product_id });

      if (!product) {
        throw new NotFoundException(`Product ${item.product_id} not found`);
      }

      // create import detail
      const price = product.import_price;

      const detail = this.importDetailRepo.create({
        import: importItem,
        product,
        quantity: item.quantity,
        price,
      });

      await this.importDetailRepo.save(detail);

      // stock
      product.stock += item.quantity;
      await this.productRepo.save(product);

      // total
      total += item.quantity * product.import_price;
    }

    importItem.total = total;
    importItem.status = Status.COMPLETED;

    await this.importRepo.save(importItem);

    const result = await this.importRepo.findOne({
      where: { id: importItem.id },
      relations: {
        created_by: true,
        import_details: {
          product: true,
        },
      },
    });

    return new ApiResponseDto(201, 'created', result);
  }

  async findAll(queryImportDto: QueryImportDto) {
    const page = parseInt(queryImportDto.page);
    const limit = parseInt(queryImportDto.limit);

    const qb = this.importRepo.createQueryBuilder('import');
    qb.leftJoinAndSelect('import.created_by', 'user');
    qb.leftJoinAndSelect('import.import_details', 'details');
    qb.leftJoinAndSelect('details.product', 'product');

    if (queryImportDto.created_by_id) {
      qb.andWhere('import.user_id = :user_id', {
        user_id: queryImportDto.created_by_id,
      });
    }

    if (queryImportDto.from) {
      qb.andWhere('import.created_at >= :from', {
        from: queryImportDto.from,
      });
    }

    if (queryImportDto.to) {
      qb.andWhere('import.created_at <= :to', {
        to: queryImportDto.to,
      });
    }

    const [field, sort] = queryImportDto.sort.split('-');
    const allowedFields = 'created_at';
    if (!allowedFields.includes(field))
      throw new BadRequestException('Invalid sort field');

    qb.orderBy(`import.${field}`, sort as 'ASC' | 'DESC');

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

    // return `This action returns all imports`;
  }

  async findOne(id: string) {
    const item = await this.importRepo.findOne({
      where: { id },
      relations: {
        created_by: true,
        import_details: {
          product: true,
        },
      },
    });
    return new ApiResponseDto(200, 'success', item);
  }
}
