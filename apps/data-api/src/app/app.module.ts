import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BackendFeaturesProductModule } from '@sharemunity-workspace/backend/features';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [BackendFeaturesProductModule,MongooseModule.forRoot('mongodb://localhost:27017/Sharemunity')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
