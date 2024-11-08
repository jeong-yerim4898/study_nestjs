import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    // default값 넣은채로 instance를 생성해도 괜찮다고 허가
    transform : true,
    transformOptions : {
      enableImplicitConversion : true
  }
  }));

  await app.listen(3000);
}
bootstrap();
