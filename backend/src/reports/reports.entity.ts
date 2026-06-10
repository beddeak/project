import { Column,CreateDateColumn,Entity,PrimaryGeneratedColumn } from "typeorm";

@Entity('reports')
export class ReportEntity {
    @PrimaryGeneratedColumn()
    id!:number;
    @Column({type:"integer"})
    reporterId!:number;
    @Column({type:"varchar"})
    reporterName!:string;
    @Column({type:"varchar"})
    content!:string;
    @Column({type:"varchar"})
    targetType!: "post" | "comment";
    @Column({type:"varchar"})
    targetId!: number;
    @Column({ type: "integer", nullable: true })
    postId!:number | null;
    @Column({ type: "text", nullable: true })
    targetTitle!: string | null;
    @Column({type:"varchar"})
    reason!:string;
    @Column({type:"varchar",default:"pending"})
    status!: "pending" | "resolved" | "rejected";
    @CreateDateColumn({type:"varchar"})
    createdAt!: Date;
}
