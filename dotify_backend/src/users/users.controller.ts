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
    @Post(':id/like-song')
    async likeSong(@Req() req) {
        const userId = req.params.id;
        const songId = req.body.songId; 
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        if (!user.id) {
            throw new BadRequestException('User ID is missing');
        }
        return this.usersService.likeSong(user.id, songId);
    }

    @Post(':id/unlike-song')
    async unlikeSong(@Req() req) {
        const userId = req.params.id;
        const songId = req.body.songId; 
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        if (!user.id) {
            throw new BadRequestException('User ID is missing');
        }
        return this.usersService.unlikeSong(user.id, songId);
    }

    @Post('findUser')
    getMe(username) {
        return this.usersService.findUserByUsername(username);
    }

    @Get(':id/liked-songs')
    async getLikedSongs(@Req() req) {
        const userId = req.params.id;
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        return user.likedSongs; 
    
    }

    
}
