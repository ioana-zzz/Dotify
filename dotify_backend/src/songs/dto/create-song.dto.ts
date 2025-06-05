import { IsEnum, IsOptional, IsString, IsUUID, IsNumber, IsBase64 } from 'class-validator';
import { Genre } from '../entities/song.entity';
import { User } from '../../users/entity/user.entity';
import { Album } from '../../album/entities/album.entity';

export class CreateSongDto {
  @IsUUID()
  artistId: string;

  @IsUUID()
  @IsOptional()
  albumId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  duration: number;

  @IsOptional()
  coverArt: string;

  @IsString()
  songData: string;

  @IsOptional()
  @IsEnum(Genre)
  genre: Genre;
}