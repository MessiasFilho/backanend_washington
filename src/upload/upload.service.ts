import { Injectable } from "@nestjs/common";
import { FileDTO } from "src/auth/dto/upload-dto";
import { createClient } from "@supabase/supabase-js"; 
import { v4 as uuidv4 } from 'uuid';
import Jimp from "jimp";
import { prismaService } from "src/prisma/prisma.service";


@Injectable()
export class uploadService{
    constructor(private readonly prisma: prismaService){

    }
    private generateUniqueName(): string {
        const uniqueId = uuidv4();
        return `${uniqueId}.png`;
      }

    async upload( File:FileDTO, inform:any  ){
        const supaURL = 'https://betspnbiptymziiuszpv.supabase.co'
        const supaKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJldHNwbmJpcHR5bXppaXVzenB2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxODEzMTE4NSwiZXhwIjoyMDMzNzA3MTg1fQ._bTAusdYDE3tggrf_GfgX3wlNZn-_9mr9rC-9aAM5b4'
     
        const uniqueName = this.generateUniqueName()
        console.log(uniqueName);
        
        const supabase = createClient(supaURL, supaKey, {auth:{ persistSession: false}})
        try {
           
            const img = await Jimp.read(File.buffer) 
            const buffer = await img.getBufferAsync(Jimp.MIME_PNG)
            
            const {error} = await supabase.storage.from('storageWashington').upload(uniqueName, buffer, {upsert: true})
                 if (error){
                    console.log(error);
                    return 
                 }

                const url = `${supaURL}/storage/v1/object/public/storageWashington/${uniqueName}`
                
                await this.prisma.imagesCollection.create({
                    data:{
                        title: inform.title, 
                        url: url, 
                        description: inform.descricao
                    }
                })
                return url
    
        }catch(e){
            console.log(e);
            return
            
        }
    }
}