import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  await app.listen(3000);
}
// bootstrap();
bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
});
