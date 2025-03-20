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
@UseGuards(JwtAuthGuard, PermissionGuard)
@SetMetadata('permissions', ['kategori_*'])
@Controller('kategori_dokumen')
export class KategoriDokumenController {
  constructor(
    private readonly kategoriDokumenService: KategoriDokumenService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Menampilkan seluruh kategori dokumen' })
  @SetMetadata('permissions', ['kategori_dokumen_all'])
  @ApiResponse({ status: 200, description: 'Sukses' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.kategoriDokumenService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Menampilkan kategori dokumen by id' })
  @SetMetadata('permissions', ['kategori_read'])
  // @OptionalHideFields('name') // `name` hanya akan disembunyikan di endpoint ini
  @ShowFields('createdAt', 'updatedAt') // createdAt & updatedAt akan tampil di endpoint ini
  findOne(@Param('id') id: string) {
    return this.kategoriDokumenService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Buat kategori dokumen baru' })
  @SetMetadata('permissions', ['kategori_store'])
  @ApiResponse({
    status: 201,
    description: 'Berhasil membuat kategori dokumen',
    type: CreateKategoriDokumenDto,
  })
  @ApiBody({ description: 'Masukkan data kategori dokumen' }) // DTO dihapus
  create(@Body() createDto: CreateKategoriDokumenDto) {
    return this.kategoriDokumenService.create(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Memperbarui kategori dokumen' })
  @SetMetadata('permissions', ['kategori_update'])
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateKategoriDokumenDto,
  ) {
    return this.kategoriDokumenService.update(Number(id), updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus kategori dokumen' })
  @SetMetadata('permissions', ['kategori_delete'])
  softDelete(@Param('id') id: string) {
    return this.kategoriDokumenService.softDelete(Number(id));
  }

  @Delete(':id/destroy')
  @ApiOperation({ summary: 'Menghapus permanen kategori dokumen' })
  @SetMetadata('permissions', ['kategori_delete'])
  @ApiExcludeEndpoint() // Menyembunyikan endpoint ini dari dokumentasi Swagger
  hardDelete(@Param('id') id: string) {
    return this.kategoriDokumenService.hardDelete(Number(id));
  }
}
