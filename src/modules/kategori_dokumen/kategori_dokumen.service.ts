import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateKategoriDokumenDto } from './dto/create-kategori_dokumen.dto';
import { UpdateKategoriDokumenDto } from './dto/update-kategori_dokumen.dto';

@Injectable()
export class KategoriDokumenService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateKategoriDokumenDto) {
    try {
      return await this.prisma.kategoriDokumen.create({ data });
    } catch (error) {
      throw new InternalServerErrorException('Gagal membuat kategori dokumen');
    }
  }

  async findAll() {
    try {
      return await this.prisma.kategoriDokumen.findMany({
        where: { deletedAt: null },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Gagal mengambil daftar kategori dokumen',
      );
    }
  }

  async findOne(id: number) {
    try {
      const kategori = await this.prisma.kategoriDokumen.findUnique({
        where: { id, deletedAt: null },
      });
      if (!kategori) throw new NotFoundException('Kategori tidak ditemukan');
      return kategori;
    } catch (error) {
      throw new InternalServerErrorException(
        'Gagal mengambil kategori dokumen',
      );
    }
  }

  async update(id: number, data: UpdateKategoriDokumenDto) {
    try {
      const kategori = await this.prisma.kategoriDokumen.findUnique({
        where: { id, deletedAt: null },
      });
      if (!kategori) throw new NotFoundException('Kategori tidak ditemukan');

      return await this.prisma.kategoriDokumen.update({
        where: { id, deletedAt: null },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Gagal memperbarui kategori dokumen',
      );
    }
  }

  async softDelete(id: number) {
    try {
      const kategori = await this.prisma.kategoriDokumen.findUnique({
        where: { id, deletedAt: null },
      });
      if (!kategori) throw new NotFoundException('Kategori tidak ditemukan');

      return await this.prisma.kategoriDokumen.update({
        where: { id, deletedAt: null },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Gagal melakukan soft delete pada kategori dokumen',
      );
    }
  }

  async hardDelete(id: number) {
    try {
      const kategori = await this.prisma.kategoriDokumen.findUnique({
        where: { id },
      });
      if (!kategori) throw new NotFoundException('Kategori tidak ditemukan');

      return await this.prisma.kategoriDokumen.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Gagal menghapus kategori dokumen secara permanen',
      );
    }
  }
}
