import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateKategoriDokumenDto {
  @IsString()
  @IsOptional()
  name?: string;
}
