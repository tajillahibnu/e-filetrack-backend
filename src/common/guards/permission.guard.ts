import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Anda belum login.');
    }

    // Ambil permissions terbaru dari database berdasarkan role user
    const userFromDb = await this.prisma.user.findUnique({
      where: { id: user.sub },
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } },
          },
        },
      },
    });

    if (!userFromDb) {
      throw new ForbiddenException('User tidak ditemukan.');
    }

    const updatedPermissions = userFromDb.role.permissions.map(
      (rp) => rp.permission.name,
    );

    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    if (updatedPermissions.includes('*')) {
      return true;
    }

    const hasPermission = requiredPermissions.some((perm) =>
      updatedPermissions.includes(perm),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Akses ditolak. Anda tidak memiliki izin.');
    }

    return true;
  }
}
