import { DynamicModule, Module } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/user/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { KategoriDokumenModule } from './modules/kategori_dokumen/kategori_dokumen.module';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ExcludeFieldsInterceptor } from './common/interceptors/exclude-fields.interceptor';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    KategoriDokumenModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ExcludeFieldsInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
