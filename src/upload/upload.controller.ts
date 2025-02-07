import { BadRequestException, Body, Controller, Get, HttpStatus, Post, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Roles } from "src/decorators/role.decorator";
import { role } from "src/enums/role.enum";
import { AuthGuard } from "src/guard/auth.guard";
import { RoleGuard } from "src/guard/role.guard";
import { uploadService } from "./upload.service";
import { ParamIdcuston } from "src/decorators/param-id.decorator";

@Controller('upload')
export class uploadController{
    constructor(private readonly uploadService: uploadService){}
    
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(role.admin)
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

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(role.admin)
    @UseInterceptors(FilesInterceptor('files',10,{
        fileFilter(req, file, callback) {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)){
                return callback(new BadRequestException('Unsupported file type'), false);
            }
            callback(null, true);
        },
    }))
    @Post('photos')
    async uploadphotos(@UploadedFiles() phothos: Array<Express.Multer.File>, @Body('id') id: string, @Res() res ) {
        const valor = JSON.parse(id)
        const {status, message} = await this.uploadService.uploadImigs(valor, phothos)
        if (!status){
            res.status(HttpStatus.BAD_REQUEST).json({error: message})
        }
            return res.status(HttpStatus.OK).json({message: message})
            
    }

    @Get('posters')
    async showPosters(){
        return this.uploadService.showPosters()
    }

    @Get('poster/:id')
    async getPoster(@ParamIdcuston() id ){
        return this.uploadService.getPosterId(id)
    }

    @Get('imgens/:id')
    async getImagens(@ParamIdcuston() id ){
        return this.uploadService.getImagens(id)
    }

}