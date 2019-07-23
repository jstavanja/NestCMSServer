import { Controller, Post, Get, Body, UsePipes, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { ValidationPipe } from '../pipes/validation.pipe';
import { AuthGuard } from '../guards/auth.guard';

@Controller('')
export class UserController {

    constructor(private userService: UserService) {}

    @Get('/users')
    @UseGuards(new AuthGuard())
    showAllUsers() {
        return this.userService.showAll();
    }

    @Post('/login')
    @UsePipes(new ValidationPipe())
    login(@Body() userLoginDTO: UserDTO) {
        return this.userService.login(userLoginDTO);
    }

    @Post('/register')
    @UsePipes(new ValidationPipe())
    register(@Body() createUserDTO: UserDTO) {
        return this.userService.register(createUserDTO);
    }
}
