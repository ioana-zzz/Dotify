import {Song} from '../../../../dotify_backend/src/songs/entities/song.entity';
import React from 'react';
import {User } from '../../../../dotify_backend/src/users/entity/user.entity';
import {Album} from '../../../../dotify_backend/src/album/entities/album.entity';

function MusicListItem({song}: {song: Song}) {
    return (
        <div>
            <div>
                <img
                    src={song.album?.coverArt ?? "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"}
                    alt="Album Cover"
                    width={60} height={60}
                    />
                <div>
                    <h3>{song.title}</h3>
                    <p>{song.artist?.username}</p>
                    <audio controls>
                        <source src={song.songData} type="audio/x-m4a" />
                    </audio>
                </div>
            </div>
        </div>
    );
}



type MusicListProps = {
  songs: Song[],
  onClick?: (songId: string) => void,
  buttonName?: string
};

const MusicList: React.FC<MusicListProps> = ({ songs, onClick, buttonName }) => {
  return (
    <div>
      {songs.map((song) => (
        <div>
        <MusicListItem key={song.id} song={song} />{
          onClick &&
        <button onClick={() => onClick && onClick(song.id)}>{buttonName}</button>}
        </div>
      ))}
    </div>
  );
};




export default MusicList;