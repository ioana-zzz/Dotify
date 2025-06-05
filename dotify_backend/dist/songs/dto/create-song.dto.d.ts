import { Genre } from '../entities/song.entity';
export declare class CreateSongDto {
    artistId: string;
    albumId: string;
    title: string;
    duration: number;
    coverArt: string;
    songData: string;
    genre: Genre;
}
