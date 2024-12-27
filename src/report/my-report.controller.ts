import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { RequestWithUser } from 'src/core/authentication/requestWithUsers.interface';
import JwtAuthenticationGuard from 'src/core/authentication/jwtAuthentication.guard';

@Controller('my-report')
export class MyReportController {
  constructor(private reportService: ReportService){}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  getMyReports(@Req()request: RequestWithUser){
    console.log(request.user.id);
    return this.reportService.getAll(request.user.id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('/:ssyId')
  getReportDetailsById(@Param('ssyId') ssy_id: number, @Req()request: RequestWithUser){
    return this.reportService.getDetailsBySemesterSchoolYearId(ssy_id, request.user.id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  createReport(@Body('ssy_id') ssy_id: number, @Req()request: RequestWithUser){
    return this.reportService.createReport(ssy_id, request.user.id);
  }
}
