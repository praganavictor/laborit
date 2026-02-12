
# Laborit - AI SQL Assistant

Um assistente inteligente desenvolvido com **NestJS** que utiliza Inteligência Artificial Generativa (**Google Gemini**) para transformar perguntas em linguagem natural em consultas SQL, executá-las no banco de dados e fornecer respostas amigáveis.

## 🚀 Tecnologias

- **Framework**: [NestJS](https://nestjs.com/)
- **Linguagem**: TypeScript
- **AI / LLM**: [Google Gemini](https://deepmind.google/technologies/gemini/) via [Vercel AI SDK](https://sdk.vercel.ai/docs)
- **Database**: MySQL com [Drizzle ORM](https://orm.drizzle.team/)
- **Linting/Formatting**: [Biome](https://biomejs.dev/)

## ✨ Funcionalidades

- **Text-to-SQL**: Converte perguntas como "Quantos produtos temos em estoque?" para SQL válido.
- **Execução Segura**: Roda a query gerada no banco de dados.
- **Respostas Humanizadas**: A IA analisa o resultado do banco e gera uma resposta natural em português.
- **API REST**: Endpoint simples para integração.

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (Versão LTS recomendada)
- [pnpm](https://pnpm.io/) (ou npm/yarn)
- Um banco de dados **MySQL** acessível.

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/praganavictor/laborit.git
cd laborit
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes chaves (exemplo):
```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
GOOGLE_GENERATIVE_AI_API_KEY="sua-chave-da-api-do-google"
```

## ▶️ Como Rodar

### Desenvolvimento
```bash
pnpm run dev
```
O servidor iniciará em `http://localhost:3000`.

### Build e Produção
```bash
pnpm run build
pnpm run start:prod
```

## 🔌 API

### `POST /questions`

Envia uma pergunta para o assistente.

**Request Body:**
```json
{
  "question": "Quais são os 5 produtos mais caros?"
}
```

**Exemplo de Resposta:**
```json
{
  "is_data_question": true,
  "query": "SELECT product_name, unit_price FROM products ORDER BY unit_price DESC LIMIT 5",
  "result": [
    { "product_name": "Côte de Blaye", "unit_price": 263.50 },
    ...
  ],
  "response": "Os 5 produtos mais caros são: Côte de Blaye, Thüringer Rostbratwurst..."
}
```

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📝 Licença

Este projeto é [UNLICENSED](LICENSE).
