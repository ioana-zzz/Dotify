import { User } from '../../users/entity/user.entity';
import { Album } from '../../album/entities/album.entity';
export declare enum Genre {
    Pop = "Pop",
    Rock = "Rock",
    Jazz = "Jazz",
    Classical = "Classical",
    HipHop = "HipHop",
    Country = "Country",
    Reggae = "Reggae",
    Blues = "Blues",
    Electronic = "Electronic",
    RnB = "RnB"
}
export declare class Song {
    id: string;
    title: string;
    duration: number;
    artist: User;
    likedBy: User[];
    album: Album;
    songData: string;
    genre?: Genre | null;
}
