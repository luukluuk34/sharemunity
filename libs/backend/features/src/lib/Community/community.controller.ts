import { Controller, Get, Logger, Param, UseGuards,Post, Request, Body, UploadedFiles } from "@nestjs/common";
import { CommunityService } from "./community.service";
import { ICommunity } from "@sharemunity-workspace/shared/api";
import { AuthGuard } from "@sharemunity-workspace/backend/auth";
import { LocalImageFileInterceptor, UpdateProductDto } from "@sharemunity-workspace/backend/dto";

@Controller('community')
export class CommunityController{
    private readonly logger: Logger = new Logger(CommunityController.name);
    constructor(private communityService:CommunityService){}

    @Get('')
    getAll(): Promise<ICommunity[]> {
        return this.communityService.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): Promise<ICommunity | null> {
        return this.communityService.findOne(id);
    } 

    @Post('')
    @UseGuards(AuthGuard)
    @LocalImageFileInterceptor()
    create(
        @Request() req:any,
        @Body() data: UpdateProductDto,
        @UploadedFiles() image:Express.Multer.File
    ):Promise<ICommunity | null> {
        this.logger.debug(image)
        req.body.communityImage = image;
        return this.communityService.create(req);
    }
    

}