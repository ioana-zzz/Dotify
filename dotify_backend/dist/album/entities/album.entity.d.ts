import { Song } from '../../songs/entities/song.entity';
import { User } from '../../users/entity/user.entity';
export declare class Album {
    id: string;
    title: string;
    songs: Song[];
    artist: User;
    coverArt: string;
}
