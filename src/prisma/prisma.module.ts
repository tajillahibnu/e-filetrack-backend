import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Pastikan diekspor agar bisa digunakan di modul lain
})
export class PrismaModule {}
