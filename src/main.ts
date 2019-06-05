import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: console, cors: true });
  app.useGlobalPipes(new ValidationPipe());

  // Enabling helmet to secure the app with headers
  app.use(helmet());

  // Swagger setup
  const options = new DocumentBuilder()
    .setTitle('Nest Note API')
    .setDescription('Note Rest API with user management')
    .setVersion('1.0')
    .addTag('notes')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/swagger', app, document);

  await app.listen(3000);
}
bootstrap();
