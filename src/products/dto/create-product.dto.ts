import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'coke' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'soft drink' })
  @IsString()
  description!: string;

  @ApiProperty({ example: 6000 })
  @IsDecimal()
  import_price!: number;

  @ApiProperty({ example: 8000 })
  @IsDecimal()
  export_price!: number;

  @ApiProperty({ example: '' })
  @IsString()
  image!: string;

  @ApiProperty({ example: '' })
  @IsString()
  category_id!: string;
}
