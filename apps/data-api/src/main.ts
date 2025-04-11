/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ApiResponseInterceptor } from '@sharemunity-workspace/backend/dto';
import { environment} from '@sharemunity/shared/util-env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const corsOptions: CorsOptions = {
    origin:['*'],
    methods:['GET','HEAD','POST','PUT','PATCH','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials:true
  };
  app.enableCors(corsOptions);
  app.useGlobalInterceptors(new ApiResponseInterceptor);


  const port = environment.port || 3000;
  const running = environment.dataApiUrl;
  Logger.log("Prod: " + environment.production)
  await app.listen(port);
  Logger.log(
    `Data API is running on: ${environment.dataApiUrl}`
  );
}

bootstrap();
