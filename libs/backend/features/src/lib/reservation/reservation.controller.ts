import { Body, Controller, Get,Post, Logger, Param, UseGuards, Request } from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { FirebaseService } from "../firebase/firebase.service";
import { IReservaton } from "@sharemunity-workspace/shared/api";
import { AuthGuard } from "@sharemunity-workspace/backend/auth";
import { CreateReservationDto } from "@sharemunity-workspace/backend/dto";


@Controller('reservation')
export class ReservationController{
    private readonly logger: Logger = new Logger(ReservationController.name);
    constructor(private reservationService: ReservationService, private firebaseRepository:FirebaseService){ }

    @Get('')
    getAll(): Promise<IReservaton[]>{
        this.logger.log("test");
        return this.reservationService.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): Promise<IReservaton | null>{
        return this.reservationService.findOne(id);
    }

    @Post('')
    @UseGuards(AuthGuard)
    create(
        @Request() req:any,
        @Body() data:CreateReservationDto,
    ): Promise<IReservaton | null>{
        return this.reservationService.create(req);
    }


}