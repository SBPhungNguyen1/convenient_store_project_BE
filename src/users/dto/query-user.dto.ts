import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryUserDto {
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
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;
}
