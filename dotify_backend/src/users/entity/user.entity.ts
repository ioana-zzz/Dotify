import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable, ManyToMany, OneToMany} from 'typeorm';
import {Song} from '../../songs/entities/song.entity';
import { Album } from 'src/album/entities/album.entity';

export enum UserRole{
    User = 'User',
    Artist = 'Artist'
}

@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    id:string | undefined;

    @Column()
    username:string;

    @Column()
    email:string;

    @Column()
    password:string;

    @Column({ type: 'text', nullable: true }) 
    profilePicture: string | null;

    @Column({type: 'enum', enum: UserRole})
    role: UserRole

    @ManyToMany(type => Song, (song) => song.likedBy)
    @JoinTable()
    likedSongs: Song[]; 

    @OneToMany( type => Song, (song) => song.artist)
    publishedSongs: Song[]; 


    @OneToMany(type => Album, (album) => album.artist)
    publishedAlbums: Album[];
}


