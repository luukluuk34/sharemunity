import { Controller, Get, Logger, Param, UseGuards,Post, Request, Body, UploadedFiles, Put, Delete } from "@nestjs/common";
import { CommunityService } from "./community.service";
import { ICommunity } from "@sharemunity-workspace/shared/api";
import { AuthGuard } from "@sharemunity-workspace/backend/auth";
import { LocalImageFileInterceptor, UpdateCommunityDto, UpdateProductDto } from "@sharemunity-workspace/backend/dto";

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
        @Body() data: UpdateCommunityDto,
        @UploadedFiles() image:Express.Multer.File
    ):Promise<ICommunity | null> {
        req.body.communityImage = image;
        return this.communityService.create(req);
    }

    @Put(':id')
    update(
        @Param('id') id:string,
        @Request() req:any,
        @Body() data: UpdateCommunityDto,
    ):Promise<ICommunity | null>{
        return this.communityService.update(id,data);
    }

    @Delete(':id')
    delete(@Param('id') id:string):Promise<ICommunity | null>{
        return this.communityService.delete(id);
    }
    

}