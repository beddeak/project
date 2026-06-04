import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { Repository } from 'typeorm';
import { create } from 'domain';

@Injectable()
export class UsersService {
    constructor (
        @InjectRepository(UserEntity)
        private readonly UserServiceRepository: Repository<UserEntity>
    ) {}
    async 
}
