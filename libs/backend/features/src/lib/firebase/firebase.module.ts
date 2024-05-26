import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FirebaseService } from './firebase.service';


@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}