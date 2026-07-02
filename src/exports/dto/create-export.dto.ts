import { ApiProperty } from '@nestjs/swagger';

export class CreateExportDto {
  @ApiProperty({ example: '' })
  buyer_user_id!: string;

  @ApiProperty({ example: [{ product_id: '', quantity: 2 }] })
  items!: CreateExportDetailDto[];
}

export class CreateExportDetailDto {
  @ApiProperty({ example: '' })
  product_id!: string;

  @ApiProperty({ example: 2 })
  quantity!: number;
}
