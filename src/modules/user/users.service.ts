import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    // ✅ Cek apakah roleId ada di database
    const roleExists = await this.prisma.role.findUnique({
      where: { id: createUserDto.roleId },
    });

    if (!roleExists) {
      throw new BadRequestException('Role ID tidak ditemukan.');
    }

    const hashedPassword = createUserDto.password
      ? await bcrypt.hash(createUserDto.password, 10)
      : null;
    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        username: createUserDto.username,
        email: createUserDto.email,
        password: hashedPassword,
        roleId: createUserDto.roleId, // ❗ Pakai roleId, bukan role
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // async update(id: number, data: Partial<UpdateUserDto>) {
  //   const updateData: Partial<UpdateUserDto> = { ...data };

  //   if (typeof data.password === 'string' && data.password.trim() !== '') {
  //     updateData.password = await bcrypt.hash(data.password, 10);
  //   }

  //   return this.prisma.user.update({
  //     where: { id },
  //     data: {
  //       ...updateData,
  //       role: updateData.role ? { connect: { name: updateData.role } } : undefined, // ✅ Fix Role
  //     },
  //   });
  // }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
