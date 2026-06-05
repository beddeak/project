import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {
    constructor (
        @InjectRepository(UserEntity)
        private readonly UserServiceRepository: Repository<UserEntity>
    ) {}
    async findAll() {
        return await this.UserServiceRepository.find();
    }
    async findOne(id:number): Promise<UserEntity> {
        const user = await this.UserServiceRepository.findOne({where: {id}})

        if(!user) {
            throw new NotFoundException("유저 정보를 찾을수가 없습니다")
        }

        return user;
    }
    async findByUsername(username:string): Promise<UserEntity> {
        const user = await this.UserServiceRepository.findOneBy({username})

        if(!user) {
            throw new NotFoundException("유저 닉네임을 찾을수가 없습니다")
        }

        return user;
    }

    async create(name:string,username:string,email:string,password:string): Promise<UserEntity> {
        const newUser = this.UserServiceRepository.create({
            name,
            username,
            email,
            password,
            role:"user",
        });

        return await this.UserServiceRepository.save(newUser);
    }
}
