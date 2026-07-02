import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'beverage' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'something to drink' })
  @IsString()
  description!: string;
}
