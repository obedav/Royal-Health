// src/modules/company/company.module.ts
import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';

@Module({
  controllers: [CompanyController],
})
export class CompanyModule {}
