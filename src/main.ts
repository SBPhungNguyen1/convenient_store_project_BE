import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  // swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS CRUD API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const host = configService.get<string>(`HOST`);
  const port = configService.get<number>('PORT');
  await app.listen(process.env.PORT ?? 3000);

  console.log(`Server is running at http://${host}:${port}`);
  console.log(`Swagger: http://${host}:${port}/api`);
}
bootstrap();
