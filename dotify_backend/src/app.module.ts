import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entity/user.entity'; // asigură-te că ai importat corect User
import { SongsModule } from './songs/songs.module';
import { Song } from './songs/entities/song.entity'; 
import { AlbumModule } from './album/album.module';
import { Album } from './album/entities/album.entity'; // asigură-te că ai importat corect Album
import { NamingStrategyNotFoundError } from 'typeorm';

@Module({
  imports: [UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',      
      password: 'ioana',     
      database: 'musicapp',
      entities: [User, Song,Album],
      synchronize: true,        
    }),
    SongsModule,
    AlbumModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
