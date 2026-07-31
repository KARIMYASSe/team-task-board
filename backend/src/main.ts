import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 5000;
  app.enableCors({
    origin: 'http://localhost:5173',
  });
  await app.listen(PORT, () => {
    console.log(`the project works on  ${PORT}`);
  });
}
bootstrap();
