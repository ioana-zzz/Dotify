import { Injectable , NotFoundException, BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UserDto } from './dto/user.dto';
import { Song } from '../songs/entities/song.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,

        @InjectRepository(Song)
        private songsRepository: Repository<Song>,
    ) {}

    async createUser(userDto: UserDto): Promise<User> {
        const newUser = this.usersRepository.create(userDto);
        return this.usersRepository.save(newUser);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

   async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
        where: { id }, 
        relations: ['likedSongs']
    });
}

    async update(id: string, user: Partial<User>): Promise<void> {
        await this.usersRepository.update(id, user);
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }


    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ email });
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.findByEmail(email);
        if (user && user.password === password) {
            return user;
        }
        return null;
    }


    async findUserByUsername(username: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ username });
    }

    async likeSong(userId: string, songId: string): Promise<void> {
    const userExists = await this.usersRepository.findOne({ where: { id: userId } });
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const songExists = await this.songsRepository.findOne({ where: { id: songId } });
    if (!songExists) {
      throw new NotFoundException('Song not found');
    }

    const likedSongs = await this.usersRepository
      .createQueryBuilder()
      .relation(User, 'likedSongs')
      .of(userId)
      .loadMany();

    const existingRelation = likedSongs.find((song: Song) => song.id === songId);
    if (existingRelation) {
      throw new BadRequestException('Song is already liked');
    }

    await this.usersRepository
      .createQueryBuilder()
      .relation(User, 'likedSongs')
      .of(userId)
      .add(songId);
  }

  async unlikeSong(userId: string, songId: string): Promise<void> {
    await this.usersRepository
      .createQueryBuilder()
      .relation(User, 'likedSongs')
      .of(userId)
      .remove(songId);
  }

  

}
