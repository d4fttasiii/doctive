import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfig } from 'doctive-core';
import fastifyCookie from '@fastify/cookie';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      cors: {
        origin: 'http://localhost:4200',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
      }
    }
  );
  await app.register(fastifyCookie);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const document = SwaggerModule.createDocument(app, new DocumentBuilder()
    .setTitle('Doctive API')
    .setDescription('The Doctive API description')
    .setVersion('1.0')
    .build());

  SwaggerModule.setup('swagger', app, document);

  const configService = app.get<ConfigService>(ConfigService);
  const cfg = configService.get<AppConfig>('app');

  await app.listen(cfg.port, '0.0.0.0', () => console.log(`🩺Backoffice-API🩺 started on port: ${cfg.port}`));

}
bootstrap();
