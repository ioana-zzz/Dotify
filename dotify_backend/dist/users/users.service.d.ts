import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UserDto } from './dto/user.dto';
import { Song } from '../songs/entities/song.entity';
export declare class UsersService {
    private usersRepository;
    private songsRepository;
    constructor(usersRepository: Repository<User>, songsRepository: Repository<Song>);
    createUser(userDto: UserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User | null>;
    update(id: string, user: Partial<User>): Promise<void>;
    remove(id: string): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
    validateUser(email: string, password: string): Promise<User | null>;
    findUserByUsername(username: string): Promise<User | null>;
    likeSong(userId: string, songId: string): Promise<void>;
    unlikeSong(userId: string, songId: string): Promise<void>;
}
