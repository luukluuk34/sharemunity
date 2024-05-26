import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Image as ImageModel, ImageDocument } from './image.schema';
import { Product as ProductModel, ProductDocument } from '../product/product.schema';
import { IImage, IProduct } from '@sharemunity-workspace/shared/api';
import { CreateImageDto, UpdateImageDto } from '@sharemunity-workspace/backend/dto';
import {
    UserDocument,
    User as UserModel
} from '@sharemunity-workspace/user';

@Injectable()
export class ImageService {
    private readonly logger: Logger = new Logger(ImageService.name);

    constructor(
        @InjectModel(ImageModel.name) private imageModel: Model<ImageDocument>,
        @InjectModel(ProductModel.name) private productModel: Model<ProductDocument>
    ) {}

    /**
     * Zie https://mongoosejs.com/docs/populate.html#population
     *
     * @returns
     */
    async findAll(): Promise<IImage[]> {
        this.logger.log(`Finding all items`);
        const items = await this.imageModel
            .find()
            .populate('product', 'name description status')
            .exec();
        return items;
    }


    async create(req: any): Promise<IImage | null> {
        const image = req.body;
        const product_id = req.product.product_id;

        if (image && product_id) {
            this.logger.log(`Create Image ${image.name} for product_id ${product_id} `);
            const product = await this.productModel
                .findOne({ _id: product_id })
                .select('-name -description -status -__v')
                .exec();
            const createdItem = {
                ...image,
                product: product,
            };
            return this.imageModel.create(createdItem);
        }
        return null;
    }

    async update(_id: string, image: UpdateImageDto): Promise<IImage | null> {
        this.logger.log(`Update product ${image.filename}`);
        return this.imageModel.findByIdAndUpdate({ _id }, image);
    }
}
