import { Controller, Get, Post, Body, BadRequestException, Req } from '@nestjs/common';


import { UsersModule } from './users.module';
import { User, UserRole } from './entity/user.entity';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Get()
    async Hello() {
        return { message : 'Hello from UsersController!' };
   }

    @Post('register')
    async registerUser(@Body() userData: UserDto): Promise<User> {
        return this.usersService.createUser(userData);
      }


    @Post('login')
    async loginUser(@Body()loginData: { email: string; password: string }): Promise<User | null> {
        const { email, password } = loginData;
        const user = await this.usersService.validateUser(email, password);
        if (!user) {
            throw new BadRequestException('Invalid credentials');
        }
        return user;
    }

    @Post('findUser')
    getMe(username) {
        return this.usersService.findUserByUsername(username);
    }
    
    }
