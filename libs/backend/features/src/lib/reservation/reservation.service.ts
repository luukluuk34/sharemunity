import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Reservation as ReservationModel, ReservationtDocument } from "./reservation.schema";
import { User as UserModel, UserDocument } from "@sharemunity-workspace/backend/user";
import { ProductDocument, Product as ProductModel} from "../product/product.schema"
import { Model } from "mongoose";
import { FirebaseService } from "../firebase/firebase.service";
import { IReservation, ProductStatus, ReservationStatus } from "@sharemunity-workspace/shared/api";
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

  async findAll(): Promise<IReservation[]> {
    this.logger.log(`Finding all reservations`);
    const items = await this.reservationModel
      .find()
      .populate('owner','name emailAddress address')
      .populate('enjoyer','name emailAddress address')
      .exec();
    return items;
  }

  async findMyReservations(req:any):Promise<IReservation[]>{
    this.logger.log(`Finding all reservations that are mine`);
    const user_id = req.user.user_id;
    const items = await this.reservationModel
    .find({
      'enjoyer':user_id
    })
    .populate('owner','name emailAddress address')
    .populate('enjoyer','name emailAddress address')
    .populate('product','name status')
    .exec();
  return items;
  } 

  async findAllWherePending(req:any): Promise<IReservation[]>{
    this.logger.log(`Finding all reservations that are pending`);
    const user_id = req.user.user_id;
    const items = await this.reservationModel
      .find({
        reservation_status: ReservationStatus.Pending,
        'owner':user_id
      })
      .populate('owner','name emailAddress address')
      .populate('enjoyer','name emailAddress address')
      .populate('product','name status')
      .exec();
    return items;
  }

  async findOne(_id: string): Promise<IReservation | null> {
    this.logger.log(`finding Reservation with id ${_id}`);
    const item = await this.reservationModel
      .findOne({ _id })
      .populate('enjoyer')
      .populate('owner')
      .exec();
    if (!item) {
      this.logger.debug('Item not found');
    }
    return item;
  }

  async findOneFromProdId(_id:string):Promise<IReservation | null>{
    this.logger.log(`Finding reservation from product ID ${_id}`);
    const item =  await this.reservationModel
      .findOne({product:_id})
      .populate('enjoyer')
      .populate('owner')
      .exec()
    if(!item){
      this.logger.debug(`Reservation not found`);
    }
    return item;
  }

  async create(req: any): Promise<IReservation | null>{
    this.logger.debug(`Creating Reservation for `)
    var reservation = req.body;
    this.logger.debug(reservation)
    const enjoyer_id = req.user.user_id;
    let product = await this.productModel
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
        product.status = ProductStatus.Reserved;
        await product.save();
        this.logger.log(createdReservation);
        return this.reservationModel.create(createdReservation);
    }
    return null;
  }

    async update(
      _id: string,
      reservation: UpdateReservationDto
    ): Promise<IReservation | null> {
      this.logger.log(`Update reservation for product:  ${reservation.product.name}`);
      this.logger.debug(reservation);
      return this.reservationModel.findByIdAndUpdate({ _id }, reservation);
    }

    async delete(_id:string):Promise<IReservation | null>{
      this.logger.log(`Deleting reservation ${_id}`);
      return this.reservationModel.findByIdAndDelete({_id});
    }

}