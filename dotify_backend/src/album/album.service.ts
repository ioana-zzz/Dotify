import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}