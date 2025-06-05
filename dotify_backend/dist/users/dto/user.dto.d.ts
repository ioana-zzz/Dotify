import { UserRole } from '../entity/user.entity';
export declare class UserDto {
    username: string;
    email: string;
    password: string;
    profilePicture?: string | null;
    role: UserRole;
}
