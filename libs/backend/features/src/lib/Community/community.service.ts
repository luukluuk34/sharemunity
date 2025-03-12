import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CommunityDocument, Community as CommunityModel } from "./community.schema";
import { UserDocument, User as UserModel } from "@sharemunity-workspace/user";

import { Model } from "mongoose";
import { ICommunity } from "@sharemunity-workspace/shared/api";
import { environment } from "@sharemunity/shared/util-env";
import { FirebaseService } from "../firebase/firebase.service";
import { UpdateCommunityDto } from "@sharemunity-workspace/backend/dto";


@Injectable()
export class CommunityService {
    private readonly logger: Logger = new Logger(CommunityService.name);


    constructor(
        @InjectModel(CommunityModel.name)
        private communityModel:Model<CommunityDocument>,
        @InjectModel(UserModel.name)
        private userModel:Model<UserDocument>,
        private readonly firebaseService:FirebaseService
    ){}

    async findAll(): Promise<ICommunity[]>{
        this.logger.log('Finding all communities');
        const communities = await this.communityModel
            .find()
            .populate('owner', 'name emailAddress address')
            .populate('members','name emailAddress address')
            .populate('products', 'name')
            .exec()
        this.logger.log(`Sending back: ${communities}`)
        return communities;
    }

    async findOne(_id: string): Promise<ICommunity | null>{
       this.logger.log(`Finding community with id ${_id}`)
        const community = await this.communityModel.findOne({_id}).exec();
        if(!community){
            this.logger.debug(`Community not found`);
        }
        return community;
    }
    
    async create(req:any): Promise<ICommunity | null>{
        var community = req.body;
        this.logger.debug(community);
        community['communityImage'] = {
            filename: req.body.communityImage[0].filename,
            encoding: req.body.communityImage[0].encoding,
            mimetype: req.body.communityImage[0].mimetype,
            path: req.body.communityImage[0].path,
            size: req.body.communityImage[0].size,
        };

        this.logger.debug(community);
        if(environment.production){
            this.logger.log("Uploading Image")
            const path = await this.firebaseService.uploadImage(community.communityImage);
            community.communityImage.path = path;
        }
        

        const user_id = req.user.user_id;
        if(community && user_id){
            this.logger.log(`Creating community ${community.name}`)
            const user = await this.userModel
                .findOne({_id:user_id})
                .select('-password -products -address -role -__v')
                .exec();
            const createdCommunity = {
                ...community,
                owner:user,
            };

            return this.communityModel.create(createdCommunity);       
        }
        return null;
    }
    async update(
        _id:string,
        community:UpdateCommunityDto
    ): Promise<ICommunity | null> {
        this.logger.log(`Update community`)
        return this.communityModel.findByIdAndUpdate({_id}, community);
    }

}