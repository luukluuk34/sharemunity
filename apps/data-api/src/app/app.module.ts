import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BackendFeaturesProductModule } from '@sharemunity-workspace/backend/features';


@Module({
  imports: [BackendFeaturesProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
