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
  ) { }

  // ✅ Fungsi untuk mencari user dengan role & permissions
  private async findUserWithRoleAndPermissions(userIdOrUsername: string, isUserId = false) {
    return this.prisma.user.findUnique({
      where: isUserId ? { id: parseInt(userIdOrUsername, 10) } : { username: userIdOrUsername },
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } },
          },
        },
      },
    });
  }

  // ✅ Fungsi untuk hashing dan validasi password
  private async comparePassword(plainText: string, hash: string) {
    return bcrypt.compare(plainText, hash);
  }

  // ✅ Fungsi untuk membuat payload JWT
  private createPayload(user: any) {
    return {
      sub: user.id,
      role: user.role.name,
      permissions: user.role.permissions.map((rp) => rp.permission.name),
    };
  }

  // ✅ Fungsi untuk menyimpan refresh token
  private async updateUserRefreshToken(userId: number, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { 
        refreshToken: hashedToken,
        lastLogin: new Date(),
      },
    });
  }

  async validateUser(username: string, password: string) {
    const user = await this.findUserWithRoleAndPermissions(username, false);
    if (!user || !(await this.comparePassword(password, user.password))) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const payload = this.createPayload(user);
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' });

    await this.updateUserRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, user };
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.findUserWithRoleAndPermissions(userId.toString(), true);
    if (!user || !user.refreshToken || !(await this.comparePassword(refreshToken, user.refreshToken))) {
      throw new UnauthorizedException('Refresh token tidak valid');
    }

    const payload = this.createPayload(user);
    return { accessToken: this.jwtService.sign(payload) };
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { message: 'Logout berhasil' };
  }

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

  async login(data: LoginDto) {
    const user = await this.findUserWithRoleAndPermissions(data.username, false);
    if (!user || !(await this.comparePassword(data.password, user.password))) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const payload = this.createPayload(user);
    const token = this.jwtService.sign(payload);

    return { accessToken: token, user };
  }

}
