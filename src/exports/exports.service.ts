/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { CreateExportDto } from './dto/create-export.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { Export } from './entities/export.entity';
import { ExportDetail } from './entities/export_detail.entity';
import { Status } from 'src/common/enums/status.enum';
import { ApiResponseDto } from 'src/common/interfaces/api-response.interface';
import { QueryExportDto } from './dto/query-export.dto';

@Injectable()
export class ExportsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Export)
    private readonly exportRepo: Repository<Export>,

    @InjectRepository(ExportDetail)
    private readonly exportDetailRepo: Repository<ExportDetail>,
  ) {}
  async create(createExportDto: CreateExportDto, @Req() req) {
    // 1. check created_by_user
    // 2. check buyer
    // 3. check stock available
    // 4. buy: create export >> create export detail + sum total >> minus stock >> save total

    // 1.
    const email = req.user.email as string;
    const current_user = await this.userRepo.findOne({ where: { email } });
    if (!current_user)
      throw new NotFoundException('No current user data found');

    // 2.
    const user = await this.userRepo.findOne({
      where: { id: createExportDto.buyer_user_id },
    });
    if (!user) throw new NotFoundException('No buyer found');

    // 3.
    for (const item of createExportDto.items) {
      const product = await this.productRepo.findOne({
        where: { id: item.product_id },
      });
      if (!product)
        throw new NotFoundException(
          `Not found product with ID ${item.product_id}`,
        );

      if (product.stock < item.quantity)
        throw new BadRequestException(
          `Stock is not available for product ${item.product_id}`,
        );
    }

    // 4
    // a
    const newExport = this.exportRepo.create({
      total: 0,
      status: Status.PENDING,
      created_by: current_user,
      buyer: user,
    });
    await this.exportRepo.save(newExport);

    // b
    let total = 0;
    for (const item of createExportDto.items) {
      const product = await this.productRepo.findOne({
        where: { id: item.product_id },
      });
      if (!product)
        throw new NotFoundException(
          `Not found product with ID ${item.product_id}`,
        );

      const newExportDetail = this.exportDetailRepo.create({
        export: newExport,
        product: product,
        quantity: item.quantity,
        price: product.export_price,
      });
      await this.exportDetailRepo.save(newExportDetail);

      total += item.quantity * product.export_price;
      product.stock = product.stock - item.quantity;
      await this.productRepo.save(product);
    }

    // c.
    newExport.total = total;
    newExport.status = Status.COMPLETED;

    await this.exportRepo.save(newExport);

    const result = await this.exportRepo.findOne({
      where: { id: newExport.id },
      relations: {
        buyer: true,
        created_by: true,
        export_details: {
          product: true,
        },
      },
    });

    return new ApiResponseDto(201, 'created', result);
  }

  async findAll(queryExportDto: QueryExportDto) {
    const page = parseInt(queryExportDto.page);
    const limit = parseInt(queryExportDto.limit);

    const qb = this.exportRepo.createQueryBuilder('export');
    qb.leftJoinAndSelect('export.export_details', 'export_details');
    qb.leftJoinAndSelect('export_details.product', 'product');
    qb.leftJoinAndSelect('export.buyer', 'buyer');
    qb.leftJoinAndSelect('export.created_by', 'createdBy');

    if (queryExportDto.from) {
      qb.andWhere(`export.created_at >= :from`, { from: queryExportDto.from });
    }

    if (queryExportDto.to) {
      qb.andWhere(`export.created_at <= :to`, { to: queryExportDto.to });
    }

    const [field, sort] = queryExportDto.sort.split('-');
    const allowedFields = ['created_at'];
    if (!allowedFields.includes(field))
      throw new BadRequestException('Invalid sort field');

    qb.orderBy(`export.${field}`, sort as 'ASC' | 'DESC');

    let items: any[];
    let total: number;
    if (limit === -1) {
      items = await qb.getMany();
      total = items.length;

      return new ApiResponseDto(201, 'created', {
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

    return new ApiResponseDto(201, 'created', {
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
    const item = await this.exportRepo.findOne({
      where: { id },
      relations: {
        buyer: true,
        created_by: true,
        export_details: {
          product: true,
        },
      },
    });
    if (!item) throw new NotFoundException('No export found');
    return new ApiResponseDto(200, 'success', item);
  }
}
