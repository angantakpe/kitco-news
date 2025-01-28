const { generateArticle } = require('../../services/openai/article.openai.service');
const Article = require('../../models/article.model');

const validateArticleResponse = (parsedMessage) => {
  const requiredFields = [
    'title',
    'content',
    'author',
    'publishedDate',
    'tags',
    'category',
    'relatedCompanies',
    'marketData',
  ];

  for (const field of requiredFields) {
    if (!parsedMessage[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  return parsedMessage;
};

const createArticleFromResponse = async (parsedMessage, language, pressRelease) => {
  const article = new Article();

  if (language === 'french') {
    article.title = pressRelease.title || '';
    article.titleFr = parsedMessage.title || '';
    article.content = pressRelease.content || '';
    article.contentFr = parsedMessage.content || '';
  } else {
    article.title = parsedMessage.title || '';
    article.titleFr = pressRelease.title || '';
    article.content = parsedMessage.content || '';
    article.contentFr = pressRelease.content || '';
  }

  article.author = parsedMessage.author || '';
  article.publishedDate = parsedMessage.publishedDate || '';
  article.tags = parsedMessage.tags || [];
  article.category = parsedMessage.category || '';
  article.relatedCompanies = parsedMessage.relatedCompanies || [];
  article.marketData = parsedMessage.marketData || { price: 0, marketCap: 0, change24h: 0 };

  return await article.save();
};

const generateArticleHandler = async (ws, { pressRelease, language }) => {
  try {
    const response = await generateArticle(pressRelease, language);

    let message = '';
    for await (const chunk of response) {
      for (const choice of chunk.choices) {
        const content = choice.delta.content || '';
        message += content;
        ws.send(JSON.stringify({ type: 'articleChunk', content })); // Send each chunk
      }
    }

    message = message.trim();
    if (!message) {
      throw new Error(`Failed to generate article with id ${pressRelease.id}`);
    }

    const parsedMessage = validateArticleResponse(JSON.parse(message));
    ws.send(JSON.stringify({ type: 'articleGenerated', article: parsedMessage })); // Send final article

    return await createArticleFromResponse(parsedMessage, language, pressRelease);
  } catch (error) {
    console.error('Error generating article:', error);
    ws.send(JSON.stringify({ error: 'Failed to generate article' }));
  }
};

module.exports = generateArticleHandler;
