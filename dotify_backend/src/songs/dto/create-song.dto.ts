import { IsEnum, IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';
import { Genre } from '../entities/song.entity';
import { User } from '../../users/entity/user.entity';
import { Album } from '../../album/entities/album.entity';

export class CreateSongDto {
  artist: User;

  @IsOptional()
  album?: Album;

  @IsString()
  title: string;

  @IsNumber()
  duration: number;

  songData: Buffer;

  @IsEnum(Genre)
  genre: Genre;
}