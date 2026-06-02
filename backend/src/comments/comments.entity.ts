import { Column,Entity,PrimaryGeneratedColumn } from "typeorm";

@Entity('comments')
export class CommentsEntity{
    @PrimaryGeneratedColumn()
    id!:number

    @Column()
    postId!:number

    @Column()
    content!:string
    
    @Column()
    authorId!:number

    @Column()
    authorName!:string
}