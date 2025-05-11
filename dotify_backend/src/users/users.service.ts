import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UserDto } from './dto/user.dto';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async createUser(userDto: UserDto): Promise<User> {
        const newUser = this.usersRepository.create(userDto);
        return this.usersRepository.save(newUser);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOne(id: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
    }

    async update(id: string, user: Partial<User>): Promise<void> {
        await this.usersRepository.update(id, user);
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }


    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ email });
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.findByEmail(email);
        if (user && user.password === password) {
            return user;
        }
        return null;
    }


    async findUserByUsername(username: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ username });
    }
}
