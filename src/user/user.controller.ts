import {Controller, Post, Get, Body, UsePipes, UseGuards, Req} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { ValidationPipe } from '../pipes/validation.pipe';
import { AuthGuard } from '../guards/auth.guard';
import { AuthenticatedRequestRO } from './dto/authenticatedRequest.ro';
import {UserRO} from './dto/user.ro';

@Controller('')
export class UserController {

    constructor(private userService: UserService) {}

    @Get('/user')
    @UseGuards(new AuthGuard())
    showCurrentUser(@Req() req: AuthenticatedRequestRO): UserRO {
        return req.user;
    }

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
