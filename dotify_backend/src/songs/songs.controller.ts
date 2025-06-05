import { Controller,Query, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { User } from 'src/users/entity/user.entity';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  create(@Body() createSongDto: CreateSongDto) {
    try{
    return this.songsService.createSong(createSongDto);
    }catch(error){
      console.error('Error creating song:', error.message);
      throw new Error('Failed to create song: ' + error.message);
    }
  }

  @Get()
  findAll() {
    return this.songsService.findAll();
  }


  @Get('search')
    searchSongs(@Query('name') name: string) {
    return this.songsService.findByName(name);
  }  

  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songsService.findOne(id);
  }

  @Get('artist/:id')
  findByArtist(@Param('id') artistId: string) {
    const artist = new User();
    artist.id = artistId; 
    return this.songsService.findByArtist(artist);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto) {
    return this.songsService.update(id, updateSongDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.songsService.remove(id);
  }

 


}
