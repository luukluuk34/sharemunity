import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user/user.schema';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { Community as CommunityModel,CommunitySchema } from 'libs/backend/features/src/lib/community/community.schema';

@Module({
  imports: [
      MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
          { name: CommunityModel.name, schema:CommunitySchema},
      ])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UsersModule {}
