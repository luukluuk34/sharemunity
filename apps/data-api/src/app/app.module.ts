import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BackendFeaturesProductModule } from '@sharemunity-workspace/backend/features';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule} from '@nestjs/serve-static'
import { join } from 'path';

@Module({
  imports: [
    BackendFeaturesProductModule,
    ConfigModule.forRoot({isGlobal:true}),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", '../../uploads'),
      serveRoot: '/api/uploads',
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/Sharemunity')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
