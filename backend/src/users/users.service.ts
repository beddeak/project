import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


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
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = this.UserServiceRepository.create({
            name,
            username,
            email,
            password: hashedPassword,
            role:"user",
        });

        return await this.UserServiceRepository.save(newUser);
    }
    async edit(id:number,name:string,username:string,email:string,password:string): Promise<UserEntity> {
        const user = await this.findOne(id)
        
        if (name !== undefined) {
            user.name = name;
        }
        if (username !== undefined) {
            user.username = username;
        }
        if (email !== undefined) {
            user.email = email;
        }
        if (password !== undefined) {
            const hashePassword = await bcrypt.hash(password, 10);
            user.password = hashePassword;
        }

        return await this.UserServiceRepository.save(user);
    }
    async remove(id: number): Promise<UserEntity> {
        const user = await this.findOne(id)
        await this.UserServiceRepository.remove(user)

        return user;
    }
}
