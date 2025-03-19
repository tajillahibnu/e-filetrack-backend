import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { KategoriDokumenService } from './kategori_dokumen.service';
import { CreateKategoriDokumenDto } from './dto/create-kategori_dokumen.dto';
import { UpdateKategoriDokumenDto } from './dto/update-kategori_dokumen.dto';
// import { KeepFields } from '../../common/decorators/keep-fields.decorator';
import { ShowFields } from '../../common/decorators/show-fields.decorator';
// import { OptionalHideFields } from 'src/common/decorators/optional-hide-fields.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// curl -X GET "http://localhost:3000/kategori_dokumen" -H "Authorization: Bearer $2b$10$u8QEb2YY7MWmsx/4k12zkuII/2Po/idxTNsjv9ixThV6HmUmusOqa"
@ApiTags('Kategori Dokumen')
@ApiBearerAuth() // Wajib agar Swagger mengirim token
@Controller('kategori_dokumen')
export class KategoriDokumenController {
  constructor(
    private readonly kategoriDokumenService: KategoriDokumenService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Buat kategori dokumen baru' })
  @ApiResponse({
    status: 201,
    description: 'Berhasil membuat kategori dokumen',
    type: CreateKategoriDokumenDto,
  })
  @ApiBody({ description: 'Masukkan data kategori dokumen' }) // DTO dihapus
  create(@Body() createDto: CreateKategoriDokumenDto) {
    return this.kategoriDokumenService.create(createDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['read_all_kategori_dokumen'])
  @ApiResponse({ status: 200, description: 'Sukses' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.kategoriDokumenService.findAll();
  }

  @Get(':id')
  // @OptionalHideFields('name') // `name` hanya akan disembunyikan di endpoint ini
  @ShowFields('createdAt', 'updatedAt') // createdAt & updatedAt akan tampil di endpoint ini
  findOne(@Param('id') id: string) {
    return this.kategoriDokumenService.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateKategoriDokumenDto,
  ) {
    return this.kategoriDokumenService.update(Number(id), updateDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.kategoriDokumenService.softDelete(Number(id));
  }

  @Delete(':id/destroy')
  @ApiExcludeEndpoint() // Menyembunyikan endpoint ini dari dokumentasi Swagger
  hardDelete(@Param('id') id: string) {
    return this.kategoriDokumenService.hardDelete(Number(id));
  }
}
