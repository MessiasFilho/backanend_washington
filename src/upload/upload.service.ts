import { Injectable } from "@nestjs/common";
import { FileDTO } from "src/auth/dto/upload-dto";
import { createClient } from "@supabase/supabase-js"; 
@Injectable()
export class uploadService{

    async upload(File:FileDTO){
        const supaURL = 'https://betspnbiptymziiuszpv.supabase.co'
        const supaKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJldHNwbmJpcHR5bXppaXVzenB2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxODEzMTE4NSwiZXhwIjoyMDMzNzA3MTg1fQ._bTAusdYDE3tggrf_GfgX3wlNZn-_9mr9rC-9aAM5b4'
        const supabase = createClient(supaURL, supaKey, {
            auth:{
                persistSession: false
            }
        })

        const data = await supabase.storage.from('storageWashington').upload(File.originalname, File.buffer, {upsert: true})
        
    }
}