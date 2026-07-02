/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Inject,
  Injectable,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ApiResponseDto } from 'src/common/interfaces/api-response.interface';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private jwtService: JwtService,

    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}
  async login(createAuthDto: LoginDto) {
    const item = await this.userRepo.findOne({
      where: { email: createAuthDto.email },
      select: {
        id: true,
        email: true,
        role: true,
        password: true,
        name: true,
      },
    });
    if (!item) throw new BadRequestException('No user found');

    // check match passwords
    const isMatch = await bcrypt.compare(createAuthDto.password, item.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // create payload without password
    const payload = {
      sub: item.id,
      email: item.email,
      role: item.role,
      jti: randomUUID(),
    };

    // gen access_token vs refresh_token
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    ]);

    // hash refresh_token + save to user table
    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    item.hashed_refresh_token = hashedRefreshToken;
    await this.userRepo.save(item);

    // separate password from item
    const { password, hashed_refresh_token, ...user } = item;

    return new ApiResponseDto(200, 'success', {
      user,
      access_token,
      refresh_token,
    });
  }

  async register(registerDto: RegisterDto) {
    const item = await this.userRepo.findOne({
      where: { email: registerDto.email },
    });
    if (item) throw new BadRequestException('This email has been used already');

    const isMatch = registerDto.password === registerDto.confirm_password;
    if (!isMatch) throw new BadRequestException('Passwords do not match');

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newItem = this.userRepo.create({
      name: registerDto.name,
      email: registerDto.email,
      role: Role.USER,
      password: hashedPassword,
    });

    await this.userRepo.save(newItem);

    return new ApiResponseDto(201, 'created', newItem);
  }

  async profile(@Req() req) {
    const item = await this.userRepo.findOneBy({
      email: req.user.email as string,
    });
    return new ApiResponseDto(200, 'success', item);
    // return `This action returns all auth`;
  }

  async logout(@Req() req) {
    const user: any = req.user;
    await this.userRepo.update(
      { id: user.sub },
      { hashed_refresh_token: null },
    );

    const ttl = user.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      await this.redis.set(`blacklist:${user.jti}`, '1', 'EX', ttl);
    }

    return new ApiResponseDto(200, 'success', 'Logged out');
  }

  // async logout(logoutDto: LogoutDto) {
  //   const item = await this.userRepo.findOne({
  //     where: { id: logoutDto.user_id },
  //   });
  //   if (!item) throw new BadRequestException('No user found');

  //   item.hashed_refresh_token = null;
  //   await this.userRepo.save(item);

  //   return new ApiResponseDto(200, 'success', 'Logged out');
  // }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
