import { BadRequestException, HttpStatus, Inject, Injectable, Response } from "@nestjs/common";
import { FileDTO } from "src/auth/dto/upload-dto";
import { SupabaseClient, createClient } from "@supabase/supabase-js"; 
import { v4 as uuidv4 } from 'uuid';
import * as Jimp from 'jimp';
import { prismaService } from "src/prisma/prisma.service";
import { uploadDto } from "./dto/upload_dto";


export interface uploadInterface {
    message : string, 
    id: number | null,
    status: boolean, 
}

interface CompressedImage {
    originalname: string;
    filename: string;
    buffer: Buffer;
    mimeType: string;
    size: number;
  }

@Injectable()
export class uploadService{
    constructor(private readonly prisma: prismaService, 
        @Inject('SupabaseClient') private readonly supabase: SupabaseClient
    ){}

    private generateUniqueName(): string {
        const uniqueId = uuidv4();
        return `${uniqueId}.png`;
    }

    async upload( File:FileDTO, {title, aluguel, andar, descricao, metros, sala, telefone, venda}: uploadDto): Promise <uploadInterface> {
       
        const uniqueName = this.generateUniqueName()
        try {
            const img = await Jimp.read(File.buffer) 
            const buffer = await img.getBufferAsync(Jimp.MIME_PNG)
            
            const {error} = await this.supabase.storage.from('storageWashington').upload(uniqueName, buffer, {upsert: true})
                 if (error){
                  return {status: false, message: 'error ao hopedar imagem', id: null }
                 }

                const url = `https://betspnbiptymziiuszpv.supabase.co/storage/v1/object/public/storageWashington/${uniqueName}`
                
                const page = await this.prisma.imagesCollection.create({
                        data:{
                            title, 
                            url,
                            andar, 
                            metros,
                            sala,
                            telefone,
                            aluguel,
                            venda, 
                            description: descricao
                        }
                     })
                    
                return {status: true, message: 'ok', id: page.id}
    
        }catch(e){
            console.log(e);
            return
            
        }
    }

    async uploadImigs( id: number, files: Express.Multer.File[] ): Promise <uploadInterface>{
        const uploadedImages: { url: string }[] = [];
        try{    
            
            for (const file of files){
                const image = await this.compactImages(file)
                const uniqueName = this.generateUniqueName();
                
                const { error } = await this.supabase.storage.from('storageWashington').upload(uniqueName, image.buffer, { upsert: true });
                if (error) {
                  return {status: false, message: 'erro upload storage', id: null}
                }                     
                uploadedImages.push({url: `https://betspnbiptymziiuszpv.supabase.co/storage/v1/object/public/storageWashington/${uniqueName}`}) 
                }
                const imgs = await this.prisma.imagens.createMany({
                   data: uploadedImages.map((imagens) =>({
                    url: imagens.url, 
                    collectionId: id
                   }))
               });
               if (!imgs){
                    return {status:false , message: 'error image url', id: null}
               }
         
               return {status: true, message: 'pagina criada com sucesso', id: null}

            }catch(e){
                console.error('Error processing images:', e);
                return { status: false, message: 'Error processing images', id: null };
            }
    }

    async showPosters(){
         return this.prisma.imagesCollection.findMany({
            include:{ imgens: true}
        })
    }
    
    async getPosterId(id: number){
        
    }    

    async compactImages (photo: Express.Multer.File): Promise<CompressedImage>{
            const image = await Jimp.read(photo.buffer);
             
            await image.resize(1920, Jimp.AUTO).quality(80);
             const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
        
            return{
                originalname: photo.originalname,
                filename: photo.filename,
                buffer: buffer,
                mimeType: Jimp.MIME_JPEG,
                size: buffer.length,
            };
    }


}
