import { Injectable } from '@nestjs/common'
import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import {
  customers,
  employeePrivileges,
  employees,
  inventoryTransactionTypes,
  inventoryTransactions,
  invoices,
  orderDetails,
  orderDetailsStatus,
  orders,
  ordersStatus,
  ordersTaxStatus,
  privileges,
  products,
  purchaseOrderDetails,
  purchaseOrderStatus,
  purchaseOrders,
  salesReports,
  shippers,
  strings,
  suppliers,
} from '../db/schema'
import { getTableColumns } from 'drizzle-orm'

@Injectable()
export class AiService {
  private getSchemaDefinition(): string {
    const tables = [
      { name: 'customers', schema: customers },
      { name: 'employee_privileges', schema: employeePrivileges },
      { name: 'employees', schema: employees },
      {
        name: 'inventory_transaction_types',
        schema: inventoryTransactionTypes,
      },
      { name: 'inventory_transactions', schema: inventoryTransactions },
      { name: 'invoices', schema: invoices },
      { name: 'order_details', schema: orderDetails },
      { name: 'order_details_status', schema: orderDetailsStatus },
      { name: 'orders', schema: orders },
      { name: 'orders_status', schema: ordersStatus },
      { name: 'orders_tax_status', schema: ordersTaxStatus },
      { name: 'privileges', schema: privileges },
      { name: 'products', schema: products },
      { name: 'purchase_order_details', schema: purchaseOrderDetails },
      { name: 'purchase_order_status', schema: purchaseOrderStatus },
      { name: 'purchase_orders', schema: purchaseOrders },
      { name: 'sales_reports', schema: salesReports },
      { name: 'shippers', schema: shippers },
      { name: 'strings', schema: strings },
      { name: 'suppliers', schema: suppliers },
    ]

    return tables
      .map((t) => {
        const columns = Object.values(getTableColumns(t.schema))
          .map((col: any) => `${col.name} (${col.dataType})`)
          .join(', ')
        return `Table: ${t.name}\nColumns: ${columns}`
      })
      .join('\n\n')
  }

  async generateSqlQuery(question: string) {
    const schemaDef = this.getSchemaDefinition()

    const { text: queryText } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: `
                You are a helpful assistant that converts natural language questions into SQL queries for a database using Drizzle ORM.
                
                First, determine if the user's question is related to data analysis or retrieving specific information from the provided database schema.
                
                Database Schema:
                """
                ${schemaDef}
                """

                User Question:
                """
                ${question}
                """

                Instructions:
                1. If the question is NOT related to data or the database schema (e.g., "What is the capital of France?", "Write me a poem"), return a JSON object with:
                   - "is_data_question": false
                   - "response": "Pergunta fora do escopo. Por favor, faça perguntas relacionadas aos dados."
                
                2. If the question IS related to data:
                   - Generate a valid MySQL SQL query to answer the question.
                   - Return a JSON object with:
                   - "is_data_question": true
                   - "query": "THE_SQL_QUERY_HERE"
                   - "response": null

                Output format must be strictly JSON.
            `.trim(),
    })

    try {
      const cleanedText = queryText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()
      return JSON.parse(cleanedText)
    } catch (e) {
      console.error('Failed to parse AI response:', queryText)
      return {
        is_data_question: false,
        response: 'Erro ao processar a pergunta.',
      }
    }
  }

  async generateFriendlyResponse(question: string, query: string, result: any) {
    const { text: responseText } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: `
                You are a helpful data analyst assistant.
                
                User Question: "${question}"
                
                SQL Query Executed: "${query}"
                
                Database Result:
                """
                ${JSON.stringify(result, null, 2)}
                """

                Instructions:
                - Provide a friendly, natural language answer to the user's question based on the database result.
                - If the result is a list, summarize it or list the top items naturally.
                - If the result is a single value, state it clearly.
                - If the result is empty, inform the user that no data was found.
                - Do NOT mention "JSON" or "SQL" in the final response unless asked. Just give the answer.
                - Respond in Portuguese.
            `.trim(),
    })
    return responseText
  }
}
