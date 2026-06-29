import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards,Req } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { JwtAuthGuard } from "src/auth/JwTAuth.guard";
import { Request } from "express";

type AuthenticatedRequest = Request & {
    user: {
        sub:number;
        email:string;
        role: 'user' | 'admin';
        name:string;
    }
}

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.reportsService.findAll();
    }
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Req() req:AuthenticatedRequest,@Body() body: CreateReportDto) {
        return this.reportsService.create(
            body,
            req.user.sub,
            req.user.name,
        );
    }
    @UseGuards(JwtAuthGuard)
    @Patch(':id/resolve')
    resolve(@Param("id", ParseIntPipe) id:number) {
        return this.reportsService.resolve(id);
    }
    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id:number) {
        return this.reportsService.remove(id);
    }
}
