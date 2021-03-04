import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`${port} 에서 서버 시작`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispost(() => app.close);
  }
}
bootstrap();
