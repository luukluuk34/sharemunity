import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BackendFeaturesProductModule } from '@sharemunity-workspace/backend/features';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    BackendFeaturesProductModule,
    ConfigModule.forRoot({isGlobal:true}),
    
    MongooseModule.forRoot('mongodb://localhost:27017/Sharemunity')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
