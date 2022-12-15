import { Module } from "@nestjs/common";
import { CreditUnitSubjectController } from "./credit-unit-subject.controller";
import { CreditUnitSubjectService } from "./credit-unit-subject.service";

@Module({
    controllers: [CreditUnitSubjectController],
    providers: [CreditUnitSubjectService]
})
export class CreditUnitSubjectModule {}