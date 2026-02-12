import { Module } from '@nestjs/common'
import { QuestionsModule } from './questions/questions.module'
import { AiModule } from './ai/ai.module'

@Module({
  imports: [QuestionsModule, AiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
