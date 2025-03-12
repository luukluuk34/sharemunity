import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { environment } from "@sharemunity/shared/util-env";
import { diskStorage, memoryStorage } from "multer";

export function LocalImageFileInterceptor() {
    return UseInterceptors(FilesInterceptor('images', 10, environment.production 
        ? {storage:memoryStorage()}
        : {
                storage: diskStorage({
                    destination: './uploads',
                    filename: (req, file, cb) => {
                        console.log('test');
                        const fieldname = `${Date.now()}-${file.originalname}`;
                        cb(null, fieldname);
                    },
                }),
            })
        )
}