import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber, IsString } from 'class-validator';

export class CreateImportDto {
  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({ example: [{ product_id: '', quantity: 1 }] })
  items!: CreateImportDetailDto[];
}

export class CreateImportDetailDto {
  @ApiProperty({ example: '' })
  @IsString()
  product_id!: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  quantity!: number;
}
