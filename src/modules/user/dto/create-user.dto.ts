import { IsString, IsEmail, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsInt()
  roleId: number; // ❗ Gunakan `roleId`, bukan `role`
}
