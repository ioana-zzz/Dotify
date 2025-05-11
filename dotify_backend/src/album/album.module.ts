import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './entities/album.entity'; // Import the Album entity
import { Song } from '../songs/entities/song.entity'; // Import the Song entity
import { User } from '../users/entity/user.entity'; // Import the User entity

@Module({
  imports: [TypeOrmModule.forFeature([Album, Song, User])],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
