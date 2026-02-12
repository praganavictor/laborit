import { Injectable } from '@nestjs/common'
import { AiService } from '../ai/ai.service'
import { QuestionsRepository } from './questions.repository'

@Injectable()
export class QuestionsService {
  constructor(
    private readonly aiService: AiService,
    private readonly questionsRepository: QuestionsRepository,
  ) {}

  async processQuestion(question: string) {
    // Step 1: Generate SQL Query
    const aiResponse = await this.aiService.generateSqlQuery(question)

    if (!aiResponse.is_data_question || !aiResponse.query) {
      return aiResponse
    }

    // Step 2: Execute Query
    let queryResult
    try {
      queryResult = await this.questionsRepository.executeQuery(
        aiResponse.query,
      )
    } catch (e) {
      return {
        ...aiResponse,
        response: 'Erro ao executar a consulta no banco de dados.',
        error: e.message,
      }
    }

    // Step 3: Generate Friendly Response
    const friendlyResponse = await this.aiService.generateFriendlyResponse(
      question,
      aiResponse.query,
      queryResult,
    )

    return {
      ...aiResponse,
      result: queryResult,
      response: friendlyResponse,
    }
  }
}
