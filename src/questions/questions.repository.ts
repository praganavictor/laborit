import { Injectable } from '@nestjs/common'
import { db } from '../db'
import { sql } from 'drizzle-orm'

@Injectable()
export class QuestionsRepository {
  async executeQuery(query: string): Promise<any> {
    try {
      console.log('Executing query:', query)
      const [rows] = await db.execute(sql.raw(query))
      return rows
    } catch (e) {
      console.error('Failed to execute query:', e)
      throw new Error(
        `Database execution error: ${e instanceof Error ? e.message : String(e)}`,
      )
    }
  }
}
