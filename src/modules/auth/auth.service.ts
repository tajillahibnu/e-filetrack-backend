import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Username atau password salah');
    }

    // Pastikan TypeScript mengenali struktur role & permissions
    const role = user.role as {
      name: string;
      permissions: { permission: { name: string } }[];
    };
    const permissions = role.permissions.map((rp) => rp.permission.name);

    const payload = {
      sub: user.id,
      role: role.name,
      permissions,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  // Register User
  async register(data: RegisterDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        email: data.email,
        password: hashedPassword,
        roleId: data.roleId,
      },
    });

    return { message: 'User registered successfully', user };
  }

  // Login User
  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: data.username },
      include: { role: true },
    });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const payload = { sub: user.id, role: user.role.name };
    const token = this.jwtService.sign(payload);

    return { accessToken: token, user };
  }
}
