import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product as ProductModel, ProductDocument } from './product.schema';
import { IProduct } from '@sharemunity-workspace/shared/api';
import {
  CreateProductDto,
  UpdateProductDto,
} from '@sharemunity-workspace/backend/dto';
import { UserDocument, User as UserModel } from '@sharemunity-workspace/backend/user';
import { FirebaseService } from '../firebase/firebase.service';
import * as fs from 'fs';
import { environment } from '@sharemunity/shared/util-env';
import { Community as CommunityModel, CommunityDocument } from '../community/community.schema';

@Injectable()
export class ProductService {
  private readonly logger: Logger = new Logger(ProductService.name);

  constructor(
    @InjectModel(CommunityModel.name) private communityModel: Model<CommunityDocument>,
    @InjectModel(ProductModel.name)  private productModel: Model<ProductDocument>,
    @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
    private readonly firebaseService: FirebaseService
  ) {}

  async findAll(): Promise<IProduct[]> {
    this.logger.log(`Finding all items`);
    const items = await this.productModel
      .find()
      .populate('owner', 'name emailAddress address')
      .exec();
    return items;
  }

  async findAllByCommunity(_id:string): Promise<IProduct[]> {
    this.logger.log(`Finding all items`);
    const community = await this.communityModel
      .findById({_id})
      .populate('products')
      .exec();
    if(community){
      return community.products;
    }
    return [];
  }

  async findAllByUser(_id:string): Promise<IProduct[]> {
    this.logger.log(`Finding all items`);
    const items = await this.productModel
      .find({owner:_id})
      .populate('owner', 'name emailAddress address')
      .exec();
    return items;
  }

  async findOne(_id: string): Promise<IProduct | null> {
    this.logger.log(`finding Product with id ${_id}`);
    const item = await this.productModel.findOne({ _id }).exec();
    if (!item) {
      this.logger.debug('Item not found');
    }
    return item;
  }

  async create(req: any): Promise<IProduct | null> {
    var product = req.body;
    product['images'] = [];
    this.logger.log(req.body);
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      product['images'][i] = {
        filename: file.filename,
        encoding: file.encoding,
        mimetype: file.mimetype,
        path: file.path,
        size: file.size,
      };
      if(environment.production){
        this.logger.log("Uploading image from product: ", product);
        const path = await this.firebaseService.uploadImage(file);
        product['images'][i].path = path;
      } 
    }
    const user_id = req.user.user_id;
    if (product && user_id) {
      this.logger.log(`Create product ${product.name} for ${user_id}`);
      const user = await this.userModel
        .findOne({ _id: user_id })
        .select('-password -products -address -role -__v')
        .exec();
      const createdItem = {
        ...product,
        owner: user,
      };

      this.logger.log(createdItem);

      const return_prod = this.productModel.create(createdItem);
      await this.userModel.findByIdAndUpdate(
        user_id,
        {$push: {products:product._id}},
        {new: true, useFindAndModify:false}
      );
      return return_prod;
    }
    return null;
  }

  async update(
    _id: string,
    product: UpdateProductDto
  ): Promise<IProduct | null> {
    this.logger.log(`Update product ${product.name}`);
    return this.productModel.findByIdAndUpdate({ _id }, product);
  }

  async delete(id:string):Promise<IProduct|null>{
    this.logger.log(`Deleting product ${id}`);
    return this.productModel.findOneAndDelete({_id:id}).exec();
  }
}
