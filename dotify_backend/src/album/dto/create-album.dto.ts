import { IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { Genre } from '../../songs/entities/song.entity';

export class CreateAlbumDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  artistId: string;

  @IsOptional()
  @IsEnum(Genre, { each: true })
  genres?: Genre[];
}