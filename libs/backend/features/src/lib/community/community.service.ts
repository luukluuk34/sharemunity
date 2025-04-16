import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CommunityDocument,
  Community as CommunityModel,
} from './community.schema';
import {
  UserDocument,
  User as UserModel,
} from '@sharemunity-workspace/backend/user';

import { Model, Types } from 'mongoose';
import { ICommunity } from '@sharemunity-workspace/shared/api';
import { environment } from '@sharemunity/shared/util-env';
import { FirebaseService } from '../firebase/firebase.service';
import { UpdateCommunityDto } from '@sharemunity-workspace/backend/dto';

@Injectable()
export class CommunityService {
  private readonly logger: Logger = new Logger(CommunityService.name);

  constructor(
    @InjectModel(CommunityModel.name)
    private communityModel: Model<CommunityDocument>,
    @InjectModel(UserModel.name)
    private userModel: Model<UserDocument>,
    private readonly firebaseService: FirebaseService
  ) {}

  async findAll(): Promise<ICommunity[]> {
    this.logger.log('Finding all communities');
    const communities = await this.communityModel
      .find()
      .populate('owner', 'name emailAddress address')
      .populate('members', 'name emailAddress address')
      .populate(
        'products',
        'id name description images maxUseTime status owner'
      )
      .exec();
    return communities;
  }

  async findJoinedCommunities(req: any): Promise<ICommunity[]> {
    this.logger.log('Finding all communities');
    const communities = await this.communityModel
      .find({ members: { $in: [req.user.user_id] } })
      .populate('owner', 'name emailAddress address')
      .populate('members', 'name emailAddress address')
      .populate('products', 'name description images maxUseTime status owner')
      .exec();
    return communities;
  }

  async findOwnedCommunities(req: any): Promise<ICommunity[]> {
    this.logger.debug(req);
    const communities = await this.communityModel
      .find({ owner: req.user.user_id })
      .populate('owner', 'name emailAddress address')
      .populate('members', 'name emailAddress address')
      .populate('products', 'name')
      .exec();
    this.logger.debug(communities);
    return communities;
  }

  async findOtherCommunities(req: any): Promise<ICommunity[]> {
    const communities = await this.communityModel
      .find({
        owner: { $nin: [req.user.user_id] },
        members: { $nin: [req.user.user_id] },
      })
      .populate('owner', 'name emailAddress address')
      .populate('members', 'name emailAddress address')
      .populate('products', 'name')
      .exec();
    return communities;
  }

  async findOne(_id: string): Promise<ICommunity | null> {
    this.logger.log(`Finding community with id ${_id}`);

    if (!Types.ObjectId.isValid(_id)) {
      this.logger.error(`Invalid objectId format: ${_id}`);
      throw new BadRequestException(`Invalid ID format ${_id}`);
    }
    const community = await this.communityModel
      .findOne({ _id })
      .populate('owner', 'name emailAddress address')
      .populate('members', 'name emailAddress address')
      .populate(
        'products',
        'id name description images maxUseTime status owner'
      )
      .exec();
    if (!community) {
      this.logger.debug(`Community not found`);
    }
    return community;
  }

  async create(req: any): Promise<ICommunity | null> {
    var community = req.body;
    this.logger.debug(req.body.communityImage[0].fieldname)
    this.logger.debug(req.body.communityImage[0].originalname)
    community['communityImage'] = {
      filename: `${Date.now()}-${req.body.communityImage[0].originalname}`,
      fieldname: `${Date.now()}-${req.body.communityImage[0].originalname}`,
      originalname: `${Date.now()}-${req.body.communityImage[0].originalname}`,
      encoding: req.body.communityImage[0].encoding,
      mimetype: req.body.communityImage[0].mimetype,
      path: req.body.communityImage[0].path,
      size: req.body.communityImage[0].size,
      buffer:req.body.communityImage[0].buffer
    };
    if (environment.production) {
      this.logger.log('Uploading Image');
      const path = await this.firebaseService.uploadImage(
        community.communityImage
      );
      community.communityImage.path = path;
    }
    const user_id = req.user.user_id;
    if (community && user_id) {
      this.logger.log(`Creating community ${community.name}`);
      const user = await this.userModel
        .findOne({ _id: user_id })
        .select('-password -products -address -role -__v')
        .exec();
      const createdCommunity = {
        ...community,
        members: [],
        products: [],
        owner: user,
      };

      return this.communityModel.create(createdCommunity);
    }
    return null;
  }

  async update(
    _id: string,
    community: UpdateCommunityDto,
    image?: any
  ): Promise<ICommunity | null> {
    this.logger.log(`Updating community with ID: ${_id}`);
    let updateData = {
      name: community.name,
      description: community.description,
      communityImage: community.communityImage,
      creationDate: community.creationDate,
      products: community.products,
      members: community.members,
    };

    if (image) {
      updateData['communityImage'] = image[0];
      console.log(image[0]);
    }

    this.logger.debug(updateData);
    return this.communityModel.findByIdAndUpdate({ _id }, updateData, {
      new: true,
    });
  }

  async delete(id: string): Promise<ICommunity | null> {
    this.logger.log(`Deleting community with ID: ${id}`);
    return this.communityModel.findOneAndDelete({ _id: id }).exec();
  }
}
