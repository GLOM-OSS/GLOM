import { Module } from '@nestjs/common';
import { HallAccessController } from './hall-access.controller';
import { HallAccessService } from './hall-access.service';

@Module({
  controllers: [HallAccessController],
  providers: [HallAccessService],
})
export class HallAccessModule {}
