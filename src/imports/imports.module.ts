import { Module } from '@nestjs/common';
import { ImportsService } from './imports.service';
import { ImportsController } from './imports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Import } from './entities/import.entity';
import { ImportDetail } from './entities/import_detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, User, Import, ImportDetail])],
  controllers: [ImportsController],
  providers: [ImportsService],
})
export class ImportsModule {}
