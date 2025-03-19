import { Module } from '@nestjs/common';
import { KategoriDokumenService } from './kategori_dokumen.service';
import { KategoriDokumenController } from './kategori_dokumen.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [KategoriDokumenController],
  providers: [KategoriDokumenService, PrismaService],
  exports: [KategoriDokumenService],
  imports: [AuthModule], // ⬅️ Pastikan AuthModule di-import
})
export class KategoriDokumenModule {}
