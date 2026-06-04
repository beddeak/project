import { Column,Entity,PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class UserEntity{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column()
    name!:string;

    @Column({ unique: true})
    username!:string;

    @Column()
    password!:string;

    @Column({ default: "user"})
    role!: "user" | "admin";
}