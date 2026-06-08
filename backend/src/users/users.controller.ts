import { UsersService } from './users.service';
import { Controller, Get, Param, ParseIntPipe,Post,Body,Patch,Delete } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor (private readonly userService: UsersService) {}
    @Get()
    findAll() {
        return this.userService.findAll()
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id:number) {
        return this.userService.findOne(id)
    }
    @Post()
    create(@Body() body: CreateUserDto) {
        return this.userService.create(
            body.name,
            body.username,
            body.email,
            body.password
        )
    }
    @Patch(':id')
    edit(@Param('id', ParseIntPipe) id:number,@Body() body: UpdateUserDto ) {
        return this.userService.edit(
            id,
            body.name,
            body.username,
            body.email,
            body.password,
        )
    }
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id:number) {
        return this.userService.remove(id)
    }
}
