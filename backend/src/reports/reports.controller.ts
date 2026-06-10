import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { CreateReportDto } from "./dto/create-report.dto";

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Get()
    findAll() {
        return this.reportsService.findAll();
    }
    @Post()
    create(@Body() body: CreateReportDto) {
        return this.reportsService.create(body);
    }
    @Patch(':id/resolve')
    resolve(@Param("id", ParseIntPipe) id:number) {
        return this.reportsService.resolve(id);
    }
    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id:number) {
        return this.reportsService.remove(id);
    }
}
