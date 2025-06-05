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
exports.AlbumService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const album_entity_1 = require("./entities/album.entity");
const user_entity_1 = require("../users/entity/user.entity");
let AlbumService = class AlbumService {
    albumRepository;
    constructor(albumRepository) {
        this.albumRepository = albumRepository;
    }
    async create(createAlbumDto) {
        const album = this.albumRepository.create(createAlbumDto);
        const artist = new user_entity_1.User();
        artist.id = createAlbumDto.artistId;
        album.artist = artist;
        return await this.albumRepository.save(album);
    }
    async findAll() {
        return await this.albumRepository.find({ relations: ['artist', 'songs'] });
    }
    async findOne(id) {
        const album = await this.albumRepository.findOne({
            where: { id },
            relations: ['artist', 'songs'],
        });
        if (!album) {
            throw new common_1.NotFoundException(`Album with ID ${id} not found`);
        }
        return album;
    }
    async update(id, updateAlbumDto) {
        const album = await this.albumRepository.preload({
            id,
            ...updateAlbumDto,
        });
        if (!album) {
            throw new common_1.NotFoundException(`Album with ID ${id} not found`);
        }
        return await this.albumRepository.save(album);
    }
    async remove(id) {
        const result = await this.albumRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Album with ID ${id} not found`);
        }
    }
    async findByArtist(artistId) {
        const artist = new user_entity_1.User();
        artist.id = artistId;
        const albums = await this.albumRepository.find({
            where: { artist },
            relations: ['artist', 'songs'],
        });
        if (!albums || albums.length === 0) {
            throw new common_1.NotFoundException(`No albums found for artist with ID ${artistId}`);
        }
        return albums;
    }
    async findByName(name) {
        return this.albumRepository.find({
            where: { title: (0, typeorm_2.ILike)(`%${name}%`) },
            relations: ['artist', 'songs'],
        });
    }
};
exports.AlbumService = AlbumService;
exports.AlbumService = AlbumService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(album_entity_1.Album)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AlbumService);
//# sourceMappingURL=album.service.js.map