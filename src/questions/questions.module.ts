import { Module } from '@nestjs/common'
import { AiModule } from '../ai/ai.module'
import { QuestionsController } from './questions.controller'
import { QuestionsRepository } from './questions.repository'
import { QuestionsService } from './questions.service'

@Module({
  imports: [AiModule],
  controllers: [QuestionsController],
  providers: [QuestionsService, QuestionsRepository],
})
export class QuestionsModule {}
