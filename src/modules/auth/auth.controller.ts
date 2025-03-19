import {
  Body,
  Controller,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
// import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('register')
  // async register(@Body() data: RegisterDto) {
  //   return this.authService.register(data);
  // }

  // @Post('login')
  // async login(@Body() data: LoginDto) {
  //   return this.authService.login(data);
  // }

  @Post('login/:username/:password')
  @ApiExcludeEndpoint() // Menyembunyikan endpoint ini dari dokumentasi Swagger
  async login2(
    @Param('username') username: string,
    @Param('password') password: string,
  ) {
    if (!username || !password) {
      throw new UnauthorizedException('Username dan password wajib diisi');
    }
    return this.authService.validateUser(username, password);
  }

  @Post('login')
  @ApiExcludeEndpoint() // Menyembunyikan endpoint ini dari dokumentasi Swagger
  async login(@Body() loginDto: LoginDto) {
    if (!loginDto.username || !loginDto.password) {
      throw new UnauthorizedException('Username dan password wajib diisi');
    }
    return this.authService.validateUser(loginDto.username, loginDto.password);
  }

  // @Post('login')
  // async login(@Body() loginDto: { username: string; password: string }) {
  //   if (!loginDto.username || !loginDto.password) {
  //     throw new UnauthorizedException('Username dan password wajib diisi');
  //   }
  //   return this.authService.validateUser(loginDto.username, loginDto.password);
  // }
}
