import { Module } from "@nestjs/common";
import { CodeGeneratorService } from "apps/api/src/utils/code-generator";
import { CreditUnitSubjectController } from "./credit-unit-subject.controller";
import { CreditUnitSubjectService } from "./credit-unit-subject.service";

@Module({
    controllers: [CreditUnitSubjectController],
    providers: [CreditUnitSubjectService, CodeGeneratorService]
})
export class CreditUnitSubjectModule {}