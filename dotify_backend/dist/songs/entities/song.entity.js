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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Song = exports.Genre = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entity/user.entity");
const typeorm_2 = require("typeorm");
const album_entity_1 = require("../../album/entities/album.entity");
var Genre;
(function (Genre) {
    Genre["Pop"] = "Pop";
    Genre["Rock"] = "Rock";
    Genre["Jazz"] = "Jazz";
    Genre["Classical"] = "Classical";
    Genre["HipHop"] = "HipHop";
    Genre["Country"] = "Country";
    Genre["Reggae"] = "Reggae";
    Genre["Blues"] = "Blues";
    Genre["Electronic"] = "Electronic";
    Genre["RnB"] = "RnB";
})(Genre || (exports.Genre = Genre = {}));
let Song = class Song {
    id;
    title;
    duration;
    artist;
    likedBy;
    album;
    songData;
    genre;
};
exports.Song = Song;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Song.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Song.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Song.prototype, "duration", void 0);
__decorate([
    (0, typeorm_2.ManyToOne)(type => user_entity_1.User, (user) => user.publishedSongs, { cascade: true }),
    __metadata("design:type", user_entity_1.User)
], Song.prototype, "artist", void 0);
__decorate([
    (0, typeorm_2.ManyToMany)(type => user_entity_1.User, (user) => user.likedSongs, { cascade: true }),
    __metadata("design:type", Array)
], Song.prototype, "likedBy", void 0);
__decorate([
    (0, typeorm_2.ManyToOne)(type => album_entity_1.Album, (album) => album.songs, { onDelete: 'CASCADE' }),
    __metadata("design:type", album_entity_1.Album)
], Song.prototype, "album", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Song.prototype, "songData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Genre, nullable: true }),
    __metadata("design:type", Object)
], Song.prototype, "genre", void 0);
exports.Song = Song = __decorate([
    (0, typeorm_1.Entity)()
], Song);
//# sourceMappingURL=song.entity.js.map