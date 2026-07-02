import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class LogoutDto {
  @IsUUID()
  @ApiProperty({ example: '' })
  user_id!: string;
}
