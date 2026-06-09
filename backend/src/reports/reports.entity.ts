import { Column,CreateDateColumn,Entity,PrimaryGeneratedColumn } from "typeorm";

@Entity('reports')
export class ReportEntity {
    @PrimaryGeneratedColumn()
    id!:number;
    @Column()
    reporterId!:number;
    @Column()
    reporterName!:string;
    @Column()
    content!:string;
    @Column()
    targetType!: "post" | "comment";
    @Column()
    targetId!: number;
    @Column({nullable:true})
    postId!:number | null;
    @Column({nullable:true})
    targetTitle!: string | null;
    @Column()
    reason!:string;
    @Column({default:"pending"})
    status!: "pending" | "resolved" | "rejected";
    @CreateDateColumn()
    createdAt!: Date;
}