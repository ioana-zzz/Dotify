import { Repository } from 'typeorm';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
export declare class AlbumService {
    private readonly albumRepository;
    constructor(albumRepository: Repository<Album>);
    create(createAlbumDto: CreateAlbumDto): Promise<Album>;
    findAll(): Promise<Album[]>;
    findOne(id: string): Promise<Album>;
    update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album>;
    remove(id: string): Promise<void>;
    findByArtist(artistId: string): Promise<Album[]>;
    findByName(name: string): Promise<Album[]>;
}
