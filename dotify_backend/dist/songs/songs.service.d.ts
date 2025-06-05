import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Repository } from 'typeorm';
import { Song } from './entities/song.entity';
import { User } from '../users/entity/user.entity';
import { Album } from '../album/entities/album.entity';
export declare class SongsService {
    private songsRepository;
    private albumRepository;
    private userRepository;
    constructor(songsRepository: Repository<Song>, albumRepository: Repository<Album>, userRepository: Repository<User>);
    createSong(createSongDto: CreateSongDto): Promise<Song>;
    findAll(): Promise<Song[]>;
    findOne(id: string): Promise<Song | null>;
    update(id: string, updateSongDto: UpdateSongDto): Promise<Song | null>;
    remove(id: string): Promise<void>;
    findByArtist(artist: User): Promise<Song[]>;
    findByName(name: string): Promise<Song[]>;
}
