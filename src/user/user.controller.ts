import { Body,Param ,Controller, Post,Get, Put, Patch, Delete } from "@nestjs/common";
import { createUserDto } from "./dto/createUserDto";
import { userService } from "./user.service";
import { updatePutUserDto } from "./dto/update-put-user";
import {updatePatchUserDto} from "./dto/update-patch-dto"
import { ParseIntPipe } from "@nestjs/common"

@Controller('users')
export class userController{ 
    constructor(private readonly user: userService ){}

    @Post()
    async createUser(@Body() {name,email,fone,password,confpassword}: createUserDto){
      
        return {
            name: name, 
            email: email, 
            fone: fone, 
            massege: 'user created'
        }
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
    async updateUser(@Body() {name,email,fone,password,confpassword}: updatePutUserDto, @Param('id', ParseIntPipe ) id: number){
        return {put: {
            name: name, 
            email: email, 
            fone: fone, 
            password: password, 
            confpassword: confpassword
        }}
    }

    @Patch(':id')
    async updateParcialUser(@Body() {name,email,fone,password,confpassword}: updatePatchUserDto, @Param('id', ParseIntPipe ) id: number){
        return {patch: {
            name: name, 
            email: email, 
            fone: fone, 
            password: password, 
            confpassword: confpassword
        }}
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe ) id: number){
         return {
            delete: id
         }
    }
}