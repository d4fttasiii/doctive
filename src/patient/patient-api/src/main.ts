import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfig } from 'doctive-core';
import fastifyCookie from '@fastify/cookie';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );  
  const configService = app.get<ConfigService>(ConfigService);
  const cfg = configService.get<AppConfig>('app');
  
  await app.register(fastifyCookie);

  app.enableCors(cfg.cors);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  // app.useGlobalPipes(new ValidationPipe());

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Doctive Patient API')
      .setDescription('The Doctive Patient API description')
      .setVersion('1.0')
      .build(),
  );

  SwaggerModule.setup('swagger', app, document);


  await app.listen(cfg.port, '0.0.0.0', () =>
    console.log(`🩺Doctive Patient API🩺 started on port: ${cfg.port}`),
  );
}
bootstrap();
