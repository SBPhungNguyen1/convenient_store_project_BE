import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryProductDto {
  @ApiProperty({ example: '1' })
  @IsNumberString()
  page!: number;

  @ApiProperty({ example: '10' })
  @IsNumberString()
  limit!: number;

  @ApiProperty({ example: 'created_at-DESC' })
  @IsString()
  sort!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category_id?: string;
}
