import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SECRET_KEY',
    });
  }

  async validate(payload: {
    sub: number;
    username: string;
    role: string;
    permissions: string[];
  }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub }, // Pastikan `sub` cocok dengan `id` di database
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Token tidak valid.');
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role.name,
      permissions: payload.permissions, // Gunakan permissions dari token
    };
  }
}
