import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user1@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'user1' })
  @IsString()
  name!: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @MinLength(3)
  password!: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @MinLength(3)
  confirm_password!: string;
}
