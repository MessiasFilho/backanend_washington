import { Injectable } from "@nestjs/common";
import { FileDTO } from "src/auth/dto/upload-dto";
import { createClient } from "@supabase/supabase-js"; 
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class uploadService{

    private generateUniqueName(originalName: string): string {
        const timestamp = Date.now();
        const uniqueId = uuidv4();
        const extension = originalName.split('.').pop();
        return `${timestamp}-${uniqueId}.${extension}`;
      }
    
    async upload(File:FileDTO){
        const supaURL = 'https://betspnbiptymziiuszpv.supabase.co'
        const supaKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJldHNwbmJpcHR5bXppaXVzenB2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxODEzMTE4NSwiZXhwIjoyMDMzNzA3MTg1fQ._bTAusdYDE3tggrf_GfgX3wlNZn-_9mr9rC-9aAM5b4'
        const uniqueName = this.generateUniqueName(File.originalname)
        const supabase = createClient(supaURL, supaKey, {auth:{persistSession: false}})

        const {data, error} = await supabase.storage.from('storageWashington').upload( uniqueName, File.buffer, {upsert: true})
        if (error){
            console.log(error);
            return
        }
        const url = `${supaURL}storage/v1/object/public/images/${uniqueName}`
        return url
    }
}