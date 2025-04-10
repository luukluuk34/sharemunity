import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BackendFeaturesProductModule } from '@sharemunity-workspace/backend/features';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule} from '@nestjs/serve-static'
import { join } from 'path';

@Module({
  imports: [
    BackendFeaturesProductModule,
    ConfigModule.forRoot(
      {
        isGlobal:true,
        envFilePath: '.env'
      }
    
    ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", '../../uploads'),
      serveRoot: '/api/uploads',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule here to access ConfigService
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private configService:ConfigService){}

  getDatabaseUri(): string {
    const dbUri = this.configService.get<string>('DATABASE_URL');
    return dbUri
  }

}
