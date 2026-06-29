import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from './reports.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReportEntity]), AuthModule],
  providers: [ReportsService],
  controllers: [ReportsController]
})
export class ReportsModule {}
