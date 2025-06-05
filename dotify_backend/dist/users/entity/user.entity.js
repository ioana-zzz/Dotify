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
exports.User = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const song_entity_1 = require("../../songs/entities/song.entity");
const album_entity_1 = require("../../album/entities/album.entity");
var UserRole;
(function (UserRole) {
    UserRole["User"] = "User";
    UserRole["Artist"] = "Artist";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User {
    id;
    username;
    email;
    password;
    profilePicture;
    role;
    likedSongs;
    publishedSongs;
    publishedAlbums;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", Object)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "profilePicture", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserRole }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => song_entity_1.Song, (song) => song.likedBy),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], User.prototype, "likedSongs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => song_entity_1.Song, (song) => song.artist),
    __metadata("design:type", Array)
], User.prototype, "publishedSongs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => album_entity_1.Album, (album) => album.artist),
    __metadata("design:type", Array)
], User.prototype, "publishedAlbums", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=user.entity.js.map