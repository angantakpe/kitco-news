const logger = require('../../config/logger');
const { OpenAI } = require('openai');
const Article = require('../../models/article.model');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');
const articleService = require('../article.service');

require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate an article from a press release
 * @param {string} pressRelease
 * @param {string} language
 * @returns {Promise<string>}
 */
const generateArticle = async (pressRelease, language) => {
  try {
    const prompt = `Generate a professional article based on this fake press release:\n\n${pressRelease} in ${language}

    The article should be categorized either "mining" or "crypto" the following format:
    {
      "title": "string",
      "content": "string",
      "author": "string",
      "publishedDate": "string",
      "tags": ["string"],
      "category": "string",
      "relatedCompanies": ["string"],
      "marketData": {
        "price": "number",
        "marketCap": "number",
        "change24h": "number"
      }
    }
    `;
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const message = response.choices[0].message.content.trim();
    if (!message) {
      throw new Error(`Failed to generate article from press release ${pressRelease}`);
    }

    const article = new Article({ ...JSON.parse(message) });
    await article.save();
    return article;
  } catch (error) {
    logger.error(`Error generating article in ${language}:`, error);
    throw new Error('Failed to generate article');
  }
};

/**
 * Translate an article to the missing language of the article
 * @param {ObjectId} articleId
 * @returns {Promise<string>}
 */
const translateArticle = async (articleId) => {
  try {
    const article = await articleService.getArticleById(articleId);

    if (!article) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
    }

    const language = article.contentFr == '' || article.contentFr == null ? 'french' : 'english';

    const prompt = `Translate the following article to ${language}.
      Return ONLY a JSON object in the following format, with no additional text or explanation:
      {
        "title": "translated title",
        "content": "translated content",
        "language": "${language}"
      }

      Article to translate:
      Title: ${article.title}
      Content: ${article.content}
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional translator. Always respond with valid JSON only.'
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
      max_tokens: 2000,
      temperature: 0.3, // Lower temperature for more consistent formatting
    });

    const message = response.choices[0].message.content.trim();

    if (!message) {
      throw new Error(`Failed to translate article with id ${articleId}`);
    }

    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
    } catch (parseError) {
      logger.error(`Invalid JSON response for article ${articleId}:`, message);
      throw new Error('Invalid translation format received');
    }

    // Validate the required fields
    if (!parsedMessage.title || !parsedMessage.content || !parsedMessage.language) {
      throw new Error('Missing required fields in translation response');
    }

    if (parsedMessage.language?.toLowerCase() === 'french') {
      article.titleFr = parsedMessage.title;
      article.contentFr = parsedMessage.content;
    } else if (parsedMessage.language?.toLowerCase() === 'english') {
      article.title = parsedMessage.title;
      article.content = parsedMessage.content;
    }

    await article.save();
    return article;
  } catch (error) {
    logger.error(`Error translating article with id ${articleId}:`, error.message);
    throw new Error('Failed to translate article: ' + error.message);
  }
};

/**
 * Summarize an article
 * @param {ObjectId} articleId
 * @returns {Promise<string>}
 */
const summarizeArticle = async (articleId) => {
  try {
    const article = await articleService.getArticleById(articleId);
    if (!article) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
    }

    const language = article.contentFr == '' || article.contentFr == null ? 'french' : 'english';

    const prompt = `Summarize the following article in 500 words or less in ${language}:\n\n${article.content}
    The summary should be formatted in the following format:
    {
      "summary": "string"
    }
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const message = response.choices[0].message.content.trim();

    if (!message) {
      throw new Error(`Failed to summarize article with id ${articleId}`);
    }

    const parsedMessage = JSON.parse(message);

    if (parsedMessage.summary) {
      article.summary = parsedMessage.summary || article.summary;
      await article.save();
    }

    return article;
  } catch (error) {
    logger.error(`Error summarizing article with id ${articleId}:`, error);
    throw new Error('Failed to summarize article');
  }
};

/**
 * Generate relevant tags from an article
 * @param {ObjectId} articleId
 * @returns {Promise<string[]>}
 */
const tagArticle = async (articleId) => {
  try {
    const article = await articleService.getArticleById(articleId);
    if (!article) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
    }

    const language = article.contentFr == '' || article.contentFr == null ? 'french' : 'english';

    const prompt = `Generate 3 relevant tags for this article in ${language}:\n\n${article.content}
      The tags should be formatted in the following format:
      {
        "tags": ["string"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 50,
      temperature: 0.5,
    });

    const message = response.choices[0].message.content.trim();

    if (!message) {
      throw new Error(`Failed to generate tags for article with id ${articleId}`);
    }

    const parsedMessage = JSON.parse(message);

    if (parsedMessage.tags) {
      article.tags.push(...parsedMessage.tags);
      await article.save();
    }

    return article;
  } catch (error) {
    logger.error(`Error generating tags for article with id ${articleId}:`, error);
    throw new Error('Failed to generate tags');
  }
};

module.exports = {
  generateArticle,
  translateArticle,
  summarizeArticle,
  tagArticle,
};
