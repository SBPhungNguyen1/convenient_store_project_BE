import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ApiResponseDto } from 'src/common/interfaces/api-response.interface';
import * as bcrypt from 'bcrypt';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<ApiResponseDto<User>> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const item = this.userRepo.create({
      ...createUserDto,
      password: hashedPassword,
    });
    await this.userRepo.save(item);
    return new ApiResponseDto(201, 'created', item);
  }

  async findAll(query: QueryUserDto): Promise<ApiResponseDto<any>> {
    const page = parseInt(query.page, 10);
    const limit = parseInt(query.limit, 10);

    const qb = this.userRepo.createQueryBuilder('user');

    if (query.email) {
      qb.andWhere('user.email ILIKE :email', { email: `%${query.email}%` });
    }

    if (query.name) {
      qb.andWhere('user.name ILIKE :name', { name: `%${query.name}%` });
    }

    const [field, order] = query.sort.split('-');
    const allowedFields = ['name', 'email', 'created_at'];

    if (!allowedFields.includes(field)) {
      throw new BadRequestException('Invalid sort field');
    }

    qb.orderBy(`user.${field}`, order as 'ASC' | 'DESC');

    let items: any[];
    let total: number;

    if (limit === -1) {
      items = await qb.getMany();
      total = items.length;

      return new ApiResponseDto(200, 'success', {
        items,
        meta: {
          total,
          page: 1,
          limit: -1,
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
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  }

  async findOne(id: string): Promise<ApiResponseDto<User>> {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Data not found');
    }

    return new ApiResponseDto(200, 'success', user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ApiResponseDto<User>> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const item = await this.userRepo.preload({ id, ...updateUserDto });
    if (!item) throw new NotFoundException('Data not found');
    const updated = await this.userRepo.save(item);
    return new ApiResponseDto(200, 'success', updated);
  }

  async remove(id: string): Promise<ApiResponseDto<null>> {
    const result = await this.userRepo.softDelete(id);
    if (result.affected === 0) throw new NotFoundException('Data not found');
    return new ApiResponseDto(200, 'User deleted successfully', null);
  }
}
