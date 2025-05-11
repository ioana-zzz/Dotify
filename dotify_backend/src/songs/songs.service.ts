import { Injectable} from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './entities/song.entity';
import { User } from '../users/entity/user.entity';

@Injectable()
export class SongsService {

  constructor(@InjectRepository(Song)
    private songsRepository: Repository<Song>){}

    async createSong(createSongDto: CreateSongDto): Promise<Song> {
      const newSong = this.songsRepository.create(createSongDto); 
      return this.songsRepository.save(newSong); 
    }

  async findAll(): Promise<Song[]> {
    return this.songsRepository.find();
  }

  async findOne(id: string ): Promise<Song | null> {
    return this.songsRepository.findOneBy({ id });
  }

  async update(id: string , updateSongDto: UpdateSongDto):Promise<Song | null> {
    await this.songsRepository.update(id, updateSongDto);
    return this.songsRepository.findOneBy({ id });
  }

  async remove(id: string ) {
    this.songsRepository.delete(id);
  }

  async findByArtist(artist: User): Promise<Song[]> {
    return this.songsRepository.find({where: { artist: artist }});
  }
}
