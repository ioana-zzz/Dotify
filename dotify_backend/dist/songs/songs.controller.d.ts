import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
export declare class SongsController {
    private readonly songsService;
    constructor(songsService: SongsService);
    create(createSongDto: CreateSongDto): Promise<import("./entities/song.entity").Song>;
    findAll(): Promise<import("./entities/song.entity").Song[]>;
    searchSongs(name: string): Promise<import("./entities/song.entity").Song[]>;
    findOne(id: string): Promise<import("./entities/song.entity").Song | null>;
    findByArtist(artistId: string): Promise<import("./entities/song.entity").Song[]>;
    update(id: string, updateSongDto: UpdateSongDto): Promise<import("./entities/song.entity").Song | null>;
    remove(id: string): Promise<void>;
}
