import { Entity, Column, PrimaryGeneratedColumn, EntityMetadata } from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { ManyToOne , ManyToMany
, JoinTable, JoinColumn
} from 'typeorm';

import { Album } from '../../album/entities/album.entity';

export enum Genre{
    Pop = 'Pop',
    Rock = 'Rock',
    Jazz = 'Jazz',
    Classical = 'Classical',
    HipHop = 'HipHop',
    Country = 'Country',
    Reggae = 'Reggae',
    Blues = 'Blues',
    Electronic = 'Electronic',
    RnB = 'RnB'
}


@Entity()
export class Song {
@PrimaryGeneratedColumn('uuid')
id: string | undefined;

@Column()
title: string;

@Column()
duration: number;

@ManyToOne(type => User, (user) => user.publishedSongs, { cascade: true })
artist : User

@ManyToMany(type => User, (user) => user.likedSongs, { cascade: true })
likedBy: User[];

@ManyToOne(type => Album, (album) => album.songs, { cascade: true })
album : Album

@Column({'type': 'bytea'})
songData: Buffer;

@Column({type: 'enum', enum: Genre})
genre: Genre


}
