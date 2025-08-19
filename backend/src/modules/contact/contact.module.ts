// src/modules/contact/contact.module.ts
import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';

@Module({
  controllers: [ContactController],
})
export class ContactModule {}