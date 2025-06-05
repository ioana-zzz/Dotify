import { User } from './entity/user.entity';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<User[]>;
    Hello(): Promise<{
        message: string;
    }>;
    registerUser(userData: UserDto): Promise<User>;
    loginUser(loginData: {
        email: string;
        password: string;
    }): Promise<User | null>;
    likeSong(req: any): Promise<void>;
    unlikeSong(req: any): Promise<void>;
    getMe(username: any): Promise<User | null>;
    getLikedSongs(req: any): Promise<import("../songs/entities/song.entity").Song[]>;
}
