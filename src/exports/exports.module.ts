import { Module } from '@nestjs/common';
import { ExportsService } from './exports.service';
import { ExportsController } from './exports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Export } from './entities/export.entity';
import { ExportDetail } from './entities/export_detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, User, Export, ExportDetail])],
  controllers: [ExportsController],
  providers: [ExportsService],
})
export class ExportsModule {}
