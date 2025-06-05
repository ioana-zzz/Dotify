import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstanceChecker, Repository, Like, ILike } from 'typeorm';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { User } from '../users/entity/user.entity';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album = this.albumRepository.create(createAlbumDto);
    const artist = new User();
    artist.id = createAlbumDto.artistId;
    album.artist = artist; 
    
    return await this.albumRepository.save(album);
  }

  async findAll(): Promise<Album[]> {
    return await this.albumRepository.find({ relations: ['artist', 'songs'] });
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.albumRepository.findOne({
      where: { id },
      relations: ['artist', 'songs'],
    });
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.albumRepository.preload({
      id,
      ...updateAlbumDto,
    });
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return await this.albumRepository.save(album);
  }

  async remove(id: string): Promise<void> {
    const result = await this.albumRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
  }


  async findByArtist(artistId: string): Promise<Album[]> {
    const artist = new User();
    artist.id = artistId; 

    const albums = await this.albumRepository.find({
      where: { artist },
      relations: ['artist', 'songs'],
    });

    if (!albums || albums.length === 0) {
      throw new NotFoundException(`No albums found for artist with ID ${artistId}`);
    }

    return albums;
  }


  async findByName (name: string): Promise<Album[]> {
      return this.albumRepository.find({
        where: { title:  ILike(`%${name}%`) },
        relations: ['artist', 'songs'],
      });
    }

 
}