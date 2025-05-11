import { Entity, Column, PrimaryGeneratedColumn, OneToMany,JoinTable } from 'typeorm';

import { Song } from '../../songs/entities/song.entity';
import { User } from '../../users/entity/user.entity';
import { ManyToOne } from 'typeorm';

@Entity()
export class Album {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column()
title: string;

@OneToMany(type => Song, (song) => song.album)
songs: Song[]; // Array of songs in the album

@ManyToOne(type => User, (user) => user.publishedAlbums, { cascade: true })
artist: User; 

@Column({ type: 'bytea'})
coverArt: Buffer; 



}
