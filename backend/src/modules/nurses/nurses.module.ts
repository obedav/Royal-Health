import { Module } from '@nestjs/common';
import { NursesController } from './nurses.controller';
import { NursesService } from './nurses.service';

@Module({
  controllers: [NursesController],
  providers: [NursesService],
})
export class NursesModule {}
