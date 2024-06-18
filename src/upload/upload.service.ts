import { Injectable } from "@nestjs/common";
import { FileDTO } from "src/auth/dto/upload-dto";
import { createClient } from "@supabase/supabase-js"; 
import { v4 as uuidv4 } from 'uuid';
import * as Jimp from 'jimp';
import { prismaService } from "src/prisma/prisma.service";
import { uploadDto } from "./dto/upload_dto";
import * as Multer from "multer";
import { promises } from "dns";

export interface uploadInterface {
    message : string, 
    id: number,
    status: boolean, 
}

interface CompressedImage {
    originalname: string;
    filename: string;
    buffer: string;
    mimeType: string;
    size: number;
  }

@Injectable()
export class uploadService{
    private supabase: any
  
    constructor(private readonly prisma: prismaService){
        const supaURL = 'https://betspnbiptymziiuszpv.supabase.co'
        const supaKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJldHNwbmJpcHR5bXppaXVzenB2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxODEzMTE4NSwiZXhwIjoyMDMzNzA3MTg1fQ._bTAusdYDE3tggrf_GfgX3wlNZn-_9mr9rC-9aAM5b4'
        this.supabase = createClient(supaURL, supaKey, {auth:{ persistSession: false}})
        
    }
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
        try{
            const uploadedImages: { url: string }[] = [];
         for (const file of files){
           
                const uniqueName = this.generateUniqueName();
               
                const { error, data } = await this.supabase.storage.from('storageWashington').upload(uniqueName, file.buffer, { upsert: true });
                if (error) {
                  return {status: false, message: 'erro upload storage', id: null}
                }                     
                uploadedImages.push({url: `https://betspnbiptymziiuszpv.supabase.co/storage/v1/object/public/storageWashington/${uniqueName}`}) 
                }
                await this.prisma.imagens.createMany({
                   data: uploadedImages.map((imagens) =>({
                    url: imagens.url, 
                    collectionId: id
                   }))
               });
         
            }catch(e){
                return {status:false , message: 'error images', id: null}
            }
            return {status: true, message: 'pagina criada com sucesso', id: null}
    }


    async compactImages (photos: Express.Multer.File[] ): Promise<CompressedImage[]>{

        const processFilers = []

        for (const photo of photos  ){
            
            const imagem = await Jimp.read(photo.path)
            
            await imagem.resize(1920, Jimp.AUTO).quality(80)

            const buffer = await imagem.getBufferAsync(Jimp.MIME_JPEG);

            processFilers.push({
                originalname: photo.originalname,
                filename: photo.filename,
                buffer: buffer.toString('base64'),
                mimeType: Jimp.MIME_JPEG,
                size: buffer.length,
            })

        }
        return processFilers
    }
}
