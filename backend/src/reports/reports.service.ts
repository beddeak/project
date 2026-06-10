import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportEntity } from './reports.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(ReportEntity)
        private readonly ReportRepository: Repository<ReportEntity>,
    ) {}
    findAll() {
        return this.ReportRepository.find({
            order: {
                createdAt: "DESC",
            },
        });
    }
    create(body:CreateReportDto) {
        const report = this.ReportRepository.create({
            reporterId: body.reporterId,
            reporterName: body.reporterName,
            content: body.content,
            targetType: body.targetType,
            targetId: body.targetId,
            postId: body.postId,
            targetTitle: body.targetTitle,
            reason: body.reason
        });

        return this.ReportRepository.save(report);
    }

    async resolve(id:number) {
        const report = await this.ReportRepository.findOne({
            where:{id},
        });

        if(!report) {
            throw new NotFoundException("신고를 찾을수가 없습니다")
        }

        report.status = "resolved";

        return this.ReportRepository.save(report)
    }
    async remove(id:number) {
        const report = await this.ReportRepository.findOne({
            where:{id}
        });
        if (!report) {
            throw new NotFoundException("신고를 찾을수가 없습니다")
        }

        await this.ReportRepository.remove(report)

        return report;
    }
}
