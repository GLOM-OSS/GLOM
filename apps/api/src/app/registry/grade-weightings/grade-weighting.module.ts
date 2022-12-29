import { Module } from "@nestjs/common";
import { GradeWeightingController } from "./grade-weighting.controller";
import { GradeWeightingService } from "./grade-weighting.service";

@Module({
    controllers: [GradeWeightingController],
    providers: [GradeWeightingService]
})
export class GradeWeightingModule {}