import { Inject, Injectable } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";
import { prismaService } from "src/prisma/prisma.service";

@Injectable()
export class noticeService{
    constructor(private readonly prisma: prismaService, 
        @Inject('SupabaseClient') private readonly supabase: SupabaseClient
    ){}
}