"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const song_entity_1 = require("./entities/song.entity");
const user_entity_1 = require("../users/entity/user.entity");
const album_entity_1 = require("../album/entities/album.entity");
const common_2 = require("@nestjs/common");
let SongsService = class SongsService {
    songsRepository;
    albumRepository;
    userRepository;
    constructor(songsRepository, albumRepository, userRepository) {
        this.songsRepository = songsRepository;
        this.albumRepository = albumRepository;
        this.userRepository = userRepository;
    }
    async createSong(createSongDto) {
        try {
            const artist = await this.userRepository.findOneBy({ id: createSongDto.artistId });
            if (!artist)
                throw new Error('Artist not found');
            let album;
            if (createSongDto.albumId) {
                const foundAlbum = await this.albumRepository.findOneBy({ id: createSongDto.albumId });
                album = foundAlbum === null ? undefined : foundAlbum;
                if (!album)
                    throw new Error('Album not found');
            }
            else {
                album = this.albumRepository.create({
                    title: createSongDto.title + " - Single",
                    artist: artist,
                    coverArt: createSongDto.coverArt,
                    songs: []
                });
                album = await this.albumRepository.save(album);
            }
            const newSong = this.songsRepository.create({
                ...createSongDto,
                artist,
                album,
                duration: createSongDto.duration ?? 60,
                genre: createSongDto.genre ?? song_entity_1.Genre.Pop,
                songData: createSongDto.songData,
            });
            return this.songsRepository.save(newSong);
        }
        catch (error) {
            console.error('Error creating song:', error.message);
            throw new Error('Failed to create song' + error.message);
        }
    }
    async findAll() {
        return this.songsRepository.find();
    }
    async findOne(id) {
        return this.songsRepository.findOne({
            where: { id },
            relations: ['album'],
        });
    }
    async update(id, updateSongDto) {
        await this.songsRepository.update(id, updateSongDto);
        return this.songsRepository.findOneBy({ id });
    }
    async remove(id) {
        const song = await this.songsRepository.findOne({
            where: { id },
            relations: ['album'],
        });
        if (!song) {
            throw new common_2.NotFoundException(`Song with ID ${id} not found`);
        }
        if (song.album) {
            const album = await this.albumRepository.findOne({
                where: { id: song.album.id },
                relations: ['songs'],
            });
            if (album && album.songs) {
                album.songs = album.songs.filter(s => s.id !== id);
                await this.albumRepository.save(album);
            }
        }
        await this.songsRepository.delete(id);
    }
    async findByArtist(artist) {
        return this.songsRepository.find({ where: { artist: artist }, relations: ['artist', 'album'] });
    }
    async findByName(name) {
        if (!name) {
            throw new common_2.NotFoundException('Name query parameter is required');
        }
        const songs = await this.songsRepository.find({
            where: { title: (0, typeorm_2.ILike)(`%${name}%`) },
            relations: ['artist', 'album'],
        });
        return songs || [];
    }
};
exports.SongsService = SongsService;
exports.SongsService = SongsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(song_entity_1.Song)),
    __param(1, (0, typeorm_1.InjectRepository)(album_entity_1.Album)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SongsService);
//# sourceMappingURL=songs.service.js.map