import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateKategoriDokumenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Nama Kategori dokumen',
  })
  name: string;
}
