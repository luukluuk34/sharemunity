import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product as ProductModel, ProductDocument } from './product.schema';
import { IProduct } from '@sharemunity-workspace/shared/api';
import { CreateProductDto, UpdateProductDto } from '@sharemunity-workspace/backend/dto';
import {
    UserDocument,
    User as UserModel
} from '@sharemunity-workspace/user';

@Injectable()
export class ProductService {
    private readonly logger: Logger = new Logger(ProductService.name);

    constructor(
        @InjectModel(ProductModel.name) private productModel: Model<ProductDocument>,
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>
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
        const product = req.body;
        const user_id = req.user.user_id;

        if (product && user_id) {
            this.logger.log(`Create product ${product.title} for ${user_id}`);
            const user = await this.userModel
                .findOne({ _id: user_id })
                .select('-password -products -address -role -__v')
                .exec();
            const createdItem = {
                ...product,
                owner: user,
            };
            return this.productModel.create(createdItem);
        }
        return null;
    }

    async update(_id: string, product: UpdateProductDto): Promise<IProduct | null> {
        this.logger.log(`Update product ${product.name}`);
        return this.productModel.findByIdAndUpdate({ _id }, product);
    }
}
