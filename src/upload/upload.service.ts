import { Injectable } from "@nestjs/common";
import { FileDTO } from "src/auth/dto/upload-dto";
import { createClient } from "@supabase/supabase-js"; 
import { v4 as uuidv4 } from 'uuid';
import Jimp from "jimp";


@Injectable()
export class uploadService{

    private generateUniqueName(): string {
        const uniqueId = uuidv4();
        return `${uniqueId}.png`;
      }

    async upload( File:FileDTO ){
        const supaURL = 'https://betspnbiptymziiuszpv.supabase.co'
        const supaKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJldHNwbmJpcHR5bXppaXVzenB2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxODEzMTE4NSwiZXhwIjoyMDMzNzA3MTg1fQ._bTAusdYDE3tggrf_GfgX3wlNZn-_9mr9rC-9aAM5b4'
     
        const uniqueName = this.generateUniqueName()
        console.log(uniqueName);
        
        const supabase = createClient(supaURL, supaKey, {auth:{ persistSession: false}})
        try {
           
            const img = await Jimp.read(File.buffer) 
            const buffer = await img.getBufferAsync(Jimp.MIME_PNG)
            
            const {data, error} = await supabase.storage.from('storageWashington').upload(uniqueName, buffer, {upsert: true})
           
          
                const web = 'https://betspnbiptymziiuszpv.supabase.co/storage/v1/object/public/storageWashington/1718219586393-ea7de1c1-477d-445c-a02c-da7445c2bc89.png'
                const ret = 'https://betspnbiptymziiuszpv.supabase.co/storage/v1/object/public/storageWashington/1718220229237-8226dccc-4bfa-41bc-8f6a-350910215f9b.avif    '
                const url = `${supaURL}/storage/v1/object/public/storageWashington/${uniqueName}`
                return url
    
        }catch(e){
            console.log(e);
            return
            
        }
    }
}