import { Injectable} from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InstanceChecker, Repository, ILike } from 'typeorm';
import { Song, Genre } from './entities/song.entity';
import { User } from '../users/entity/user.entity';
import { Album } from '../album/entities/album.entity'; // Import the Album entity
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class SongsService {

  constructor(@InjectRepository(Song)
    private songsRepository: Repository<Song>,
  
  @InjectRepository(Album)
  private albumRepository : Repository<Album>,

  @InjectRepository(User)
  private userRepository: Repository<User>){}

  
  
  async createSong(createSongDto: CreateSongDto): Promise<Song> {
  try{const artist = await this.userRepository.findOneBy({ id: createSongDto.artistId });
  if (!artist) throw new Error('Artist not found');

  let album: Album | undefined;

  if (createSongDto.albumId) {
    const foundAlbum = await this.albumRepository.findOneBy({ id: createSongDto.albumId });
    album = foundAlbum === null ? undefined : foundAlbum;
    if (!album) throw new Error('Album not found');
  } else {
    album = this.albumRepository.create({
      title: createSongDto.title + " - Single",
      artist: artist,
      coverArt: createSongDto.coverArt,
      songs: []
    });
    album = await this.albumRepository.save(album);
  }

  const newSong = this.songsRepository.create({
    ...createSongDto ,
    artist,
    album,
    duration: createSongDto.duration ?? 60, 
    genre: createSongDto.genre ?? Genre.Pop, 
    songData: createSongDto.songData,

  });

  return this.songsRepository.save(newSong);
} catch(error){
  console.error('Error creating song:', error.message);
  throw new Error('Failed to create song' + error.message);
}

}

  async findAll(): Promise<Song[]> {
    return this.songsRepository.find();
  }

  async findOne(id: string ): Promise<Song | null> {
    return this.songsRepository.findOne({
    where: { id },
    relations: ['album'],
  });
  }

  async update(id: string , updateSongDto: UpdateSongDto):Promise<Song | null> {
    await this.songsRepository.update(id, updateSongDto);
    return this.songsRepository.findOneBy({ id });
  }

 async remove(id: string): Promise<void> {
  const song = await this.songsRepository.findOne({
    where: { id },
    relations: ['album'],
  });
  if (!song) {
    throw new NotFoundException(`Song with ID ${id} not found`);
  }

  if (song.album) {
    const album = await this.albumRepository.findOne({
      where: { id: song.album.id },
      relations: ['songs'],
    });
    if (album && album.songs) {
      album.songs = album.songs.filter(s => s.id !== id);
      await this.albumRepository.save(album);
    }
  }

  await this.songsRepository.delete(id);
}

  async findByArtist(artist: User): Promise<Song[]> {
    return this.songsRepository.find({where: { artist: artist }, relations: ['artist', 'album']});
  }


  async findByName(name: string): Promise<Song[]> {
  if (!name) {
    throw new NotFoundException('Name query parameter is required');
  }
  const songs = await this.songsRepository.find({
     where: { title: ILike(`%${name}%`) },
    relations: ['artist', 'album'],
  });
  
  return songs || [];
}
}
