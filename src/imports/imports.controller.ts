import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ImportsService } from './imports.service';
import { CreateImportDto } from './dto/create-import.dto';
import { QueryImportDto } from './dto/query-import.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Imports')
@Controller('imports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ImportsController {
  constructor(private readonly importsService: ImportsService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createImportDto: CreateImportDto, @Req() req) {
    return this.importsService.create(createImportDto, req);
  }

  @Get()
  findAll(@Query() queryImportDto: QueryImportDto) {
    return this.importsService.findAll(queryImportDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.importsService.findOne(id);
  }
}
