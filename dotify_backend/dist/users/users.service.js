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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entity/user.entity");
const song_entity_1 = require("../songs/entities/song.entity");
let UsersService = class UsersService {
    usersRepository;
    songsRepository;
    constructor(usersRepository, songsRepository) {
        this.usersRepository = usersRepository;
        this.songsRepository = songsRepository;
    }
    async createUser(userDto) {
        const newUser = this.usersRepository.create(userDto);
        return this.usersRepository.save(newUser);
    }
    async findAll() {
        return this.usersRepository.find();
    }
    async findOne(id) {
        return this.usersRepository.findOne({
            where: { id },
            relations: ['likedSongs']
        });
    }
    async update(id, user) {
        await this.usersRepository.update(id, user);
    }
    async remove(id) {
        await this.usersRepository.delete(id);
    }
    async findByEmail(email) {
        return this.usersRepository.findOneBy({ email });
    }
    async validateUser(email, password) {
        const user = await this.findByEmail(email);
        if (user && user.password === password) {
            return user;
        }
        return null;
    }
    async findUserByUsername(username) {
        return this.usersRepository.findOneBy({ username });
    }
    async likeSong(userId, songId) {
        const userExists = await this.usersRepository.findOne({ where: { id: userId } });
        if (!userExists) {
            throw new common_1.NotFoundException('User not found');
        }
        const songExists = await this.songsRepository.findOne({ where: { id: songId } });
        if (!songExists) {
            throw new common_1.NotFoundException('Song not found');
        }
        const likedSongs = await this.usersRepository
            .createQueryBuilder()
            .relation(user_entity_1.User, 'likedSongs')
            .of(userId)
            .loadMany();
        const existingRelation = likedSongs.find((song) => song.id === songId);
        if (existingRelation) {
            throw new common_1.BadRequestException('Song is already liked');
        }
        await this.usersRepository
            .createQueryBuilder()
            .relation(user_entity_1.User, 'likedSongs')
            .of(userId)
            .add(songId);
    }
    async unlikeSong(userId, songId) {
        await this.usersRepository
            .createQueryBuilder()
            .relation(user_entity_1.User, 'likedSongs')
            .of(userId)
            .remove(songId);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(song_entity_1.Song)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map