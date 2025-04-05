import { Body, Controller, Get,Post, Logger, Param, UseGuards, Request, Req, UseInterceptors, Put } from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { FirebaseService } from "../firebase/firebase.service";
import { IReservaton } from "@sharemunity-workspace/shared/api";
import { AuthGuard } from "@sharemunity-workspace/backend/auth";
import { CreateReservationDto } from "@sharemunity-workspace/backend/dto";
import { AnyFilesInterceptor } from "@nestjs/platform-express";


@Controller('reservation')
export class ReservationController{
    private readonly logger: Logger = new Logger(ReservationController.name);
    constructor(private reservationService: ReservationService, private firebaseRepository:FirebaseService){ }

    @Get('')
    getAll(): Promise<IReservaton[]>{
        this.logger.log("test");
        return this.reservationService.findAll();
    }

    @Get('pending')
    @UseGuards(AuthGuard)
    getAllPending(@Request() req:any):Promise<IReservaton[]>{
        console.log(req.user);
        return this.reservationService.findAllWherePending(req);
    }

    @Get('my')
    @UseGuards(AuthGuard)
    getMyReservations(@Request() req:any):Promise<IReservaton[]>{
        console.log(req.user);
        return this.reservationService.findMyReservations(req);
    }

    @Get(':id')
    getOne(@Param('id') id: string): Promise<IReservaton | null>{
        return this.reservationService.findOne(id);
    }

    @Post('')
    @UseGuards(AuthGuard)
    @UseInterceptors(AnyFilesInterceptor())
    create(
        @Req() req:any,
        @Body() body:any,
    ): Promise<IReservaton | null>{
        return this.reservationService.create(req);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    update(
        @Param('id') id:string,
        @Req() req:any
    ): Promise<IReservaton | null>{
        return this.reservationService.update(id,req.body);
    }


}