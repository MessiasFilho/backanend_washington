import { Body, Controller, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Roles } from "src/decorators/role.decorator";
import { userDecorator } from "src/decorators/user-decorator";
import { role } from "src/enums/role.enum";
import { AuthGuard } from "src/guard/auth.guard";
import { RoleGuard } from "src/guard/role.guard";
import { uploadService } from "./upload.service";

@UseGuards(AuthGuard, RoleGuard)
@Roles(role.admin)
@Controller('upload')
export class uploadController{
    constructor(private readonly uploadService: uploadService){}

    @UseInterceptors(FileInterceptor('file'))

    @Post('photo')
    async UploadFoto(@userDecorator() user, @UploadedFile() photho: Express.Multer.File, @Body('inform')inf: string   ){
        const infpage = JSON.parse(inf)
       
        await this.uploadService.upload(photho,infpage )
        
        return {imagem: photho }
    }

    @UseInterceptors(FilesInterceptor('files'))
    @Post('photos')
    async uploadphotos(@UploadedFiles() photho: Express.Multer.File[], @Body() title){
        const images = photho.map(img => ({
            originalname: img.originalname,
            filename: img.filename,
        }))
        return {images, title}
    }



}