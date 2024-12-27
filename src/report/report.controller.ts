import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ReportService } from "./report.service";
import PermissionGuard from "src/core/roles/permission.guard";
import PermissionEnum from "src/core/roles/permission.enum";

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService){}

  @UseGuards(PermissionGuard(PermissionEnum.REPORT_READ))
  @Get()
  getAllReport(@Req()request){
    try {
      let teacher_id = parseInt(request.query.teacher_id);
      if(!teacher_id)
        teacher_id = null;
      return this.reportService.getAll(teacher_id);
    } catch (error) {
      throw new Error(error);
    }
    
  }
}