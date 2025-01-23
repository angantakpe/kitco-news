require('dotenv').config();
const { OpenAI } = require('openai');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

console.log(OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Example usage
async function getOpenAIResponse() {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Say this is a test' }],
    max_tokens: 5,
  });
  console.log(response.choices[0].message.content);
}

getOpenAIResponse();
