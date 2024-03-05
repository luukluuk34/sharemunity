/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ApiResponseInterceptor } from '@sharemunity-workspace/backend/dto';

import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const corsOptions: CorsOptions = {};
  app.enableCors(corsOptions);
  app.useGlobalInterceptors(new ApiResponseInterceptor);


  if(process.env.FUNCTIONS_EMULATOR){
    const port = process.env.PORT || 3000;
    await app.listen(port);
    Logger.log(
      `Data API is running on: http://localhost:${port}/${globalPrefix}`
    );
  } else {
    const expressApp = express();
    expressApp.use(`/${globalPrefix}`, new ExpressAdapter(app).getInstance());
    module.exports.app = expressApp;
  }

}

bootstrap();
