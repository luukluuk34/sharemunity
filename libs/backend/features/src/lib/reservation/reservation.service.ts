import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Reservation as ReservationModel, ReservationtDocument } from "./reservation.schema";
import { User as UserModel, UserDocument } from "@sharemunity-workspace/backend/user";
import { ProductDocument, Product as ProductModel} from "../product/product.schema"
import { Model } from "mongoose";
import { FirebaseService } from "../firebase/firebase.service";
import { IReservaton } from "@sharemunity-workspace/shared/api";
import { UpdateReservationDto } from "@sharemunity-workspace/backend/dto";

@Injectable()
export class ReservationService {
  private readonly logger: Logger = new Logger(ReservationService.name);

  constructor(
    @InjectModel(ReservationModel.name)
    private reservationModel: Model<ReservationtDocument>,

    @InjectModel(UserModel.name) 
    private userModel: Model<UserDocument>,

    @InjectModel(ProductModel.name)
    private productModel:Model<ProductDocument>,

    private readonly firebaseService: FirebaseService
  ) {}

  async findAll(): Promise<IReservaton[]> {
    this.logger.log(`Finding all reservations`);
    const items = await this.reservationModel
      .find()
      .populate('owner','name emailAddress address')
      .populate('enjoyer','name emailAddress address')
      .exec();
    return items;
  }
  async findOne(_id: string): Promise<IReservaton | null> {
    this.logger.log(`finding Product with id ${_id}`);
    const item = await this.reservationModel.findOne({ _id }).exec();
    if (!item) {
      this.logger.debug('Item not found');
    }
    return item;
  }

  async create(req: any): Promise<IReservaton | null>{
    var reservation = req.body;
    const enjoyer_id = req.user.user_id;
    const product = await this.productModel
      .findOne({_id:req.body.product})
      .exec();

    if(reservation && enjoyer_id && product){

        const enjoyer = await this.userModel
            .findOne({_id:enjoyer_id})
            .select('-password -products -address -role -_v')
            .exec();

        const owner = await this.userModel
          .findOne({_id:product.owner})
          .exec();
            
        const createdReservation = {
            ...reservation,
            owner:owner,
            product:product,
            enjoyer:enjoyer,
        }
        this.logger.log(createdReservation);
        this.logger.log("test")
        return this.reservationModel.create(createdReservation);
    }
    return null;
  }

    async update(
      _id: string,
      reservation: UpdateReservationDto
    ): Promise<IReservaton | null> {
      this.logger.log(`Update reservation for product:  ${reservation.product.name}`);
      return this.reservationModel.findByIdAndUpdate({ _id }, reservation);
    }

}