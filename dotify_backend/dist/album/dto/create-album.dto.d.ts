import { Genre } from '../../songs/entities/song.entity';
export declare class CreateAlbumDto {
    title: string;
    artistId: string;
    genres?: Genre[];
    coverArt?: string;
}
