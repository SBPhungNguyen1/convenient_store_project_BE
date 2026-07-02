import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'Nguyen Van A',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'nguyenvana@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    enum: Role,
    example: Role.USER,
  })
  @IsEnum(Role)
  role!: Role;

  @ApiProperty({
    example: '123',
  })
  @IsString()
  @MinLength(3)
  password!: string;
}
