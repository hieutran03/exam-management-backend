import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import PermissionGuard from '../../src/core/roles/permission.guard';
import PermissionEnum from '../../src/core/roles/permission.enum';
import { RequestWithUser } from '../../src/core/authentication/requestWithUsers.interface';
import JwtAuthenticationGuard from '../../src/core/authentication/jwtAuthentication.guard';

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService){}

  @UseGuards(PermissionGuard(PermissionEnum.REPORT_READ))
  @Get()
  getAllReport(){
    return this.reportService.getAll();
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('/:ssyId')
  getReportDetailsById(@Param('ssyId') ssy_id: number, @Req()request: RequestWithUser){
    return this.reportService.getDetailsBySemesterSchoolYearId(ssy_id, request.user.id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('')
  createReport(@Body('ssy_id') ssy_id: number, @Req()request: RequestWithUser){
    return this.reportService.createReport(ssy_id, request.user.id);
  }
}
