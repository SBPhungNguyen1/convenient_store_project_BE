import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ExportsService } from './exports.service';
import { CreateExportDto } from './dto/create-export.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { QueryExportDto } from './dto/query-export.dto';

@ApiTags('Exports')
@Controller('exports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExportsController {
  constructor(private readonly exportsService: ExportsService) {}

  @Post()
  create(@Body() createExportDto: CreateExportDto, @Req() req) {
    return this.exportsService.create(createExportDto, req);
  }

  @Get()
  findAll(@Query() queryExportDto: QueryExportDto) {
    return this.exportsService.findAll(queryExportDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exportsService.findOne(id);
  }
}
