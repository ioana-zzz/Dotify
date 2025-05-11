
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Album } from 'src/album/entities/album.entity';

import { Song } from 'src/songs/entities/song.entity'; // Import the Song entity
@Module({
    imports: [TypeOrmModule.forFeature([User, Album,Song])],
    controllers:[UsersController],
    providers:[UsersService],
    exports:[UsersService]
})
export class UsersModule {}
