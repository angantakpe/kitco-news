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
 * @param {string} language - 'english' or 'french'
 * @returns {Promise<Article>}
 */
const generateArticle = async (pressRelease, language) => {
  try {
    const prompt = `Generate in ${language} a professional article based on this fake press release:\n\n

      ${pressRelease}

      The response must be a valid JSON object with the following format:
      {
        "title": "Article title",
        "content": "Full article content",
        "author": "Author name",
        "publishedDate": "YYYY-MM-DD",
        "tags": ["relevant", "tags", "here"],
        "category": "mining OR crypto",
        "relatedCompanies": ["Company names"],
        "marketData": {
          "price": number,
          "marketCap": number,
          "change24h": number
        }
      }`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional financial journalist who writes about mining and cryptocurrency.',
        },
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
      throw new Error('Empty response received from OpenAI');
    }

    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
    } catch (parseError) {
      logger.error('Invalid JSON response:', message);
      throw new Error('Invalid JSON format received from OpenAI');
    }

    const requiredFields = ['title', 'content', 'author', 'category'];
    const missingFields = requiredFields.filter((field) => !parsedMessage[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Handle language-specific fields
    const article = new Article({
      title: language === 'french' ? parsedMessage.title : parsedMessage.title,
      titleFr: language === 'french' ? parsedMessage.title : '',
      content: language === 'french' ? parsedMessage.content : parsedMessage.content,
      contentFr: language === 'french' ? parsedMessage.content : '',
      author: parsedMessage.author,
      publishedDate: parsedMessage.publishedDate,
      tags: parsedMessage.tags || [],
      category: parsedMessage.category,
      relatedCompanies: parsedMessage.relatedCompanies || [],
      marketData: parsedMessage.marketData || { price: 0, marketCap: 0, change24h: 0 },
    });

    await article.save();
    return article;
  } catch (error) {
    logger.error(`Error generating article in ${language}:`, error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to generate article: ${error.message}`);
  }
};

/**
 * Translate an article to the missing language of the article
 * @param {ObjectId} articleId
 * @param {string} language
 * @returns {Promise<string>}
 */
const translateArticle = async (articleId, language) => {
  try {
    const article = await articleService.getArticleById(articleId);

    if (!article) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
    }

    console.log('translateArticle language: ', language);

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
          content: 'You are a professional translator. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
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

    if (!parsedMessage.title || !parsedMessage.content || !parsedMessage.language) {
      throw new Error('Missing required fields in translation response');
    }

    if (language === 'french') {
      article.titleFr = parsedMessage.title;
      article.contentFr = parsedMessage.content;
    } else if (language === 'english') {
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
