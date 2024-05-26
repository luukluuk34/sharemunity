import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product as ProductModel, ProductDocument } from './product.schema';
import { IProduct } from '@sharemunity-workspace/shared/api';
import {
  CreateProductDto,
  UpdateProductDto,
} from '@sharemunity-workspace/backend/dto';
import { UserDocument, User as UserModel } from '@sharemunity-workspace/user';
import { FirebaseService } from '../firebase/firebase.service';
import * as fs from 'fs';

@Injectable()
export class ProductService {
  private readonly logger: Logger = new Logger(ProductService.name);

  constructor(
    @InjectModel(ProductModel.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
    private readonly firebaseService: FirebaseService
  ) {}

  /**
   * Zie https://mongoosejs.com/docs/populate.html#population
   *
   * @returns
   */
  async findAll(): Promise<IProduct[]> {
    this.logger.log(`Finding all items`);
    const items = await this.productModel
      .find()
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
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      product['images'][i] = {
        filename: file.filename,
        encoding: file.encoding,
        mimetype: file.mimetype,
        path: file.path,
        size: file.size,
      };
      await this.uploadImage(file);
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

      return this.productModel.create(createdItem);
    }
    return null;
  }

  async uploadImage(file: any) {
    const storage = this.firebaseService.getStorageInstance();
    const bucket = storage.bucket();
    try {
      return await new Promise((resolve, reject) => {
        this.logger.debug('Doing the filestream');
        const path = './uploads/' + file.filename;
        const fileStream = fs.createReadStream(path);
        const uploadStream = bucket.file(file.filename).createWriteStream({
          contentType: file.mimetype,
        });

        this.logger.debug('uploading the filestream ' + file.filename);

        fileStream.pipe(uploadStream);

        fileStream.on('error', (error) => {
          this.logger.error('Error in fileStream: ' + error);
          reject(error);
        });

        uploadStream.on('error', (error) => {
          this.logger.error('Error in uploadStream: ' + error);
          reject(error);
        });

        uploadStream.on('finish', () => {
          const imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.filename}`;
          console.log(imageUrl);
          this.logger.debug('Finished uploading the filestream');
          try {
            fs.unlink(path, (err) => {
              if (err) {
                this.logger.error('Error deleting the file:', err);
                return;
              }
              this.logger.error('File deleted successfully');
            });
          } catch (err) {
            this.logger.error('Error deleting the local file');
          }
          resolve(imageUrl);
        });
      });
    } catch (error) {
      this.logger.error('Error uploading file:', error);
      return null; // Handle the error accordingly
    }
  }

  async update(
    _id: string,
    product: UpdateProductDto
  ): Promise<IProduct | null> {
    this.logger.log(`Update product ${product.name}`);
    return this.productModel.findByIdAndUpdate({ _id }, product);
  }
}
