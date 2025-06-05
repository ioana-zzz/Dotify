import { Song } from '../../songs/entities/song.entity';
import { Album } from 'src/album/entities/album.entity';
export declare enum UserRole {
    User = "User",
    Artist = "Artist"
}
export declare class User {
    id: string | undefined;
    username: string;
    email: string;
    password: string;
    profilePicture: string | null;
    role: UserRole;
    likedSongs: Song[];
    publishedSongs: Song[];
    publishedAlbums: Album[];
}
