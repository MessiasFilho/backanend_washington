import { Body, Controller, HttpStatus, Post, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Roles } from "src/decorators/role.decorator";
import { role } from "src/enums/role.enum";
import { AuthGuard } from "src/guard/auth.guard";
import { RoleGuard } from "src/guard/role.guard";
import { uploadService } from "./upload.service";
import { ParamIdcuston } from "src/decorators/param-id.decorator";



@UseGuards(AuthGuard, RoleGuard)
@Roles(role.admin)
@Controller('upload')
export class uploadController{
    constructor(private readonly uploadService: uploadService){}

    @UseInterceptors(FileInterceptor('file'))

    @Post('photo')
    async UploadFoto(@UploadedFile() photho: Express.Multer.File, @Body('inform')inf: string, @Res() res   ){
        const infpage = JSON.parse(inf)
       
        const upload = await this.uploadService.upload(photho, infpage )
        if (!upload.status){
            res.status(HttpStatus.BAD_REQUEST).josn({error: upload.message})
        }
        return res.status(HttpStatus.OK).json({message: upload.message, id: upload.id, status: upload.status})


    }

    @UseInterceptors(FilesInterceptor('files'))
    @Post('photos')
    async uploadphotos(@UploadedFiles() phothos: Array<Express.Multer.File>, @Body('id') id: string ) {
        const valor = JSON.parse(id)
        console.log( valor );
         
       
    }



}