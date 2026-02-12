import { Body, Controller, Post } from '@nestjs/common'
import { QuestionsService } from './questions.service'

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  async askQuestion(@Body() body: { question: string }) {
    return this.questionsService.processQuestion(body.question)
  }
}
