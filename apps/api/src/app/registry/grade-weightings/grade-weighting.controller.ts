import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthenticatedGuard } from "../../auth/auth.guard";
import { GradeWeightingService } from "./grade-weighting.service";

@Controller()
@UseGuards(AuthenticatedGuard)
export class GradeWeightingController {
    constructor(private gradeWeightingService: GradeWeightingService) {}

    @Get(':cylce_id/all')
    async getGradeWeightings(@Param('cycle_id') cycle_id: string) {
      return await this.gradeWeightingService.getAnnualGradeWeightings(cycle_id);
    }
  
    @Get(':annnual_grade_weighting_id')
    async getGradeWeighting(
      @Param('annual_grade_weighting_id') annual_grade_weighting_id: string
    ) {
      return await this.gradeWeightingService.getAnnualWeightingGrade(
        annual_grade_weighting_id
      );
    }
}