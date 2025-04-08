import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserModel, UserDocument } from './user.schema';
import { IUser, IUserIdentity, IUserInfo } from '@sharemunity-workspace/shared/api';
import { CreateUserDto, UpdateUserDto } from '@sharemunity-workspace/backend/dto';
import { Community as CommunityModel,CommunityDocument } from 'libs/backend/features/src/lib/community/community.schema';

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(
        @InjectModel(CommunityModel.name) private communityModel: Model<CommunityDocument>,
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>
    ) {}

    async findAll(): Promise<IUserInfo[]> {
        this.logger.log(`Finding all items`);
        const items = await this.userModel.find();
        return items;
    }

    async findAllInCommunity(id:string):Promise<IUserIdentity[] | null>{
        this.logger.log(`Finding all users in community ${id}`)
        const community = await this.communityModel
            .findById({_id:id})
            .populate('members')
            .exec()
        if(community){
            return community.members;
        }
        return [];
    }

    async findOne(_id: string): Promise<IUser | null> {
        this.logger.log(`finding user with id ${_id}`);
        const item = await this.userModel.findOne({ _id }).exec();
        if (!item) {
            this.logger.debug('Item not found');
        }
        return item;
    }

    async findOneByEmail(email: string): Promise<IUserInfo | null> {
        this.logger.log(`Finding user by email ${email}`);
        const item = this.userModel
            .findOne({ emailAddress: email })
            .select('-password')
            .exec();
        return item;
    }

    async create(user: CreateUserDto): Promise<IUserInfo> {
        this.logger.log(`Create user ${user.name}`);
        const createdItem = this.userModel.create(user);
        return createdItem;
    }

    async update(_id: string, user: UpdateUserDto): Promise<IUserInfo | null> {
        this.logger.log(`Update user ${user.name}`);
        return this.userModel.findByIdAndUpdate({ _id }, user);
    }
}
