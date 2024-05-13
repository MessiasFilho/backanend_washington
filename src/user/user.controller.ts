import { Body,Param ,Controller, Post,Get, Put, Patch } from "@nestjs/common";

@Controller('users')
export class userController{ 

    @Post()
    async createUser(@Body() body){
        return {body: body}
    }

    @Get()
    async showUsers(){
        return {users: []}
    }

    @Get(':id')
    async oneUser(@Param() param ){
        return {user:{param}}
    }

    @Put(':id')
    async updateUser(@Body() body, @Param() param){
        return {updated: body}
    }

    @Patch(':id')
    async updateParcialUser(@Body() body, @Param() param){
        return {updated: body}
    }
}