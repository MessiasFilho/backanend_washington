import { Global, Module } from "@nestjs/common";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

const SUPABASE_URL = 'https://betspnbiptymziiuszpv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJldHNwbmJpcHR5bXppaXVzenB2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxODEzMTE4NSwiZXhwIjoyMDMzNzA3MTg1fQ._bTAusdYDE3tggrf_GfgX3wlNZn-_9mr9rC-9aAM5b4'; 

const supabaseClient: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
@Global()
@Module({
    providers: [
        {
          provide: 'SupabaseClient',
          useValue: supabaseClient,
        },
      ],
      exports: ['SupabaseClient'],
})
export class supabseModule{

}