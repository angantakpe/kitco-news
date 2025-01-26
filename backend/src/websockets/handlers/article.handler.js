const { generateArticle } = require('../../services/openai/article.openai.service');

const generateArticleHandler = async (ws, { pressRelease, language }) => {
  try {
    const article = await generateArticle(pressRelease, language);
    ws.send(JSON.stringify(article));
  } catch (error) {
    console.error('Error generating article:', error);
    ws.send(JSON.stringify({ error: 'Failed to generate article' }));
  }
};

module.exports = generateArticleHandler;
