import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Konfigurasi Swagger
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('Dokumentasi API untuk aplikasi ini')
    .setVersion('1.0')
    .addBearerAuth() // Untuk autentikasi JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  const configService = app.get(ConfigService); // Inject ConfigService
  const port = Number(configService.get<string>('PORT')) || 3000;

  await app.listen(port);
}
// bootstrap();
bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
});
