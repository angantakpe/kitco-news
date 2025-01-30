const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createArticle = {
  body: Joi.object().keys({
    title: Joi.string().allow(null),
    titleFr: Joi.string().allow(null),
    content: Joi.string().allow(null),
    contentFr: Joi.string().allow(null),
    category: Joi.string().valid('mining', 'crypto'),
    tags: Joi.array().items(Joi.string()),
    status: Joi.string().valid('draft', 'published').default('draft'),
    relatedCompanies: Joi.array().items(Joi.string()),
    publishedDate: Joi.date().allow(null),
    marketData: Joi.object().allow(null),
    author: Joi.string().allow(null),
    language: Joi.string().valid('english', 'french').default('english'),
    summary: Joi.string().allow(null),
  }),
};

const getArticles = {
  query: Joi.object().keys({
    title: Joi.string().allow(null),
    titleFr: Joi.string().allow(null),
    content: Joi.string().allow(null),
    contentFr: Joi.string().allow(null),
    author: Joi.string().allow(null),
    category: Joi.string().valid('mining', 'crypto').allow(null),
    status: Joi.string().valid('draft', 'published').allow(null),
    tags: Joi.array().items(Joi.string()),
    relatedCompanies: Joi.array().items(Joi.string()),
    publishedDate: Joi.date().allow(null),
    marketData: Joi.object().allow(null),
    sortBy: Joi.string().allow(null),
    limit: Joi.number().integer().allow(null),
    page: Joi.number().integer().allow(null),
  }),
};

const getArticle = {
  params: Joi.object().keys({
    articleId: Joi.string().custom(objectId),
  }),
};

const updateArticle = {
  params: Joi.object().keys({
    articleId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().allow(null, ''),
      titleFr: Joi.string().allow(null, ''),
      content: Joi.string().allow(null, ''),
      contentFr: Joi.string().allow(null, ''),
      author: Joi.string().required(),
      category: Joi.string().valid('mining', 'crypto'),
      tags: Joi.array().items(Joi.string()),
      status: Joi.string().valid('draft', 'published').default('draft'),
      relatedCompanies: Joi.array().items(Joi.string()),
      publishedDate: Joi.date().allow(null),
      marketData: Joi.object().allow(null),
    })
    .min(1),
};

const deleteArticle = {
  params: Joi.object().keys({
    articleId: Joi.string().custom(objectId),
  }),
};

const generateArticle = {
  body: Joi.object().keys({
    pressRelease: Joi.string().required(),
    language: Joi.string().required(),
  }),
};

const translateArticle = {
  params: Joi.object().keys({
    articleId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    language: Joi.string().allow(null),
  }),
};

const summarizeArticle = {
  params: Joi.object().keys({
    articleId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    language: Joi.string().allow(null),
  }),
};

const tagArticle = {
  params: Joi.object().keys({
    articleId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    tags: Joi.array().items(Joi.string()),
    language: Joi.string().allow(null),
  }),
};

module.exports = {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
  generateArticle,
  translateArticle,
  summarizeArticle,
  tagArticle,
};
