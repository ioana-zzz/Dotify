import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { Type } from '@nestjs/class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entities/song.entity'; 
import { Album } from '../album/entities/album.entity'; // Import the Album entity
import { User } from '../users/entity/user.entity'; // Import the User entity

@Module({
  imports:[TypeOrmModule.forFeature([Song, Album, User])], 
  controllers: [SongsController],
  providers: [SongsService],
  exports: [SongsService], 
})
export class SongsModule {}
