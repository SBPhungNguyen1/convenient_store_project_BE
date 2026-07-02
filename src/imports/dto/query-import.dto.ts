import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryImportDto {
  @ApiProperty({ example: '1' })
  @IsNumberString()
  page!: string;

  @ApiProperty({ example: '10' })
  @IsNumberString()
  limit!: string;

  @ApiProperty({ example: 'created_at-DESC' })
  @IsString()
  sort!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  created_by_id?: string;

  @ApiPropertyOptional({ example: '2026-05-20' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ example: '2026-07-20' })
  @IsOptional()
  @IsDateString()
  to?: string;
}
