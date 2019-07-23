import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import { UserRO } from './dto/user.ro';

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async showAll(): Promise<UserRO[]> {
        const users = await this.userRepository.find();
        return users.map(user => user.toResponseObject(false));
    }

    async login(userLoginDTO: UserDTO): Promise<UserRO> {
        const { username, password } = userLoginDTO;
        const user = await this.userRepository.findOne({ where: { username } });

        if (!user || !(await user.comparePassword(password))) {
            throw new UnauthorizedException('Invalid username/password');
        }

        return user.toResponseObject();
    }

    async register(createUserDTO: UserDTO): Promise<UserRO> {
        const { username } = createUserDTO;

        let user = await this.userRepository.findOne({ where: { username }});
        if (user) {
            throw new BadRequestException('User already exists.');
        }

        user = await this.userRepository.create(createUserDTO);
        await this.userRepository.save(user);

        return user.toResponseObject();
    }
}
