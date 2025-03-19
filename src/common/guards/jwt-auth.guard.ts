import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Anda belum login. Silakan login terlebih dahulu.',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
      return true;
    } catch (error) {
      // Memeriksa apakah error adalah instance dari Error
      if (error instanceof Error) {
        throw new UnauthorizedException('Token tidak valid atau sudah expired');
      } else {
        // Tangani kesalahan lain yang tidak terduga
        throw new UnauthorizedException('Terjadi kesalahan saat memverifikasi token');
      }
    }
  }
}