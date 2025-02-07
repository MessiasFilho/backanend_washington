import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class prismaService extends PrismaClient implements OnModuleInit{
    async onModuleInit() {
        await this.$connect(); 
    } 

    async onModuleDistri(){
        await this.$disconnect();
    }
 
}

