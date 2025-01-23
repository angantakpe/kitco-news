const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { articleService } = require('../services');
const { articleAiService } = require('../services');
const { userService } = require('../services');

const createArticle = catchAsync(async (req, res) => {
  const article = await articleService.createArticle(req.body);
  res.status(httpStatus.CREATED).send(article);
});

const getArticles = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    'title',
    'titleFr',
    'content',
    'contentFr',
    'summary',
    'summaryFr',
    'author',
    'status',
    'category',
    'relatedCompanies',
  ]);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await articleService.queryArticles(filter, options);
  res.send(result);
});

const getArticle = catchAsync(async (req, res) => {
  const article = await articleService.getArticleById(req.params.articleId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }
  res.send(article);
});

const updateArticle = catchAsync(async (req, res) => {
  const article = await articleService.updateArticleById(req.params.articleId, req.body);
  res.send(article);
});

const deleteArticle = catchAsync(async (req, res) => {
  await articleService.deleteArticleById(req.params.articleId);
  res.status(httpStatus.NO_CONTENT).send();
});

const generateArticle = catchAsync(async (req, res) => {
  const article = await articleAiService.generateArticle(req.body.pressRelease, req.body.language);
  res.status(httpStatus.CREATED).send(article);
});

const translateArticle = catchAsync(async (req, res) => {
  const article = await articleAiService.translateArticle(req.params.articleId);
  res.status(httpStatus.CREATED).send(article);
});

const summarizeArticle = catchAsync(async (req, res) => {
  const article = await articleAiService.summarizeArticle(req.params.articleId);
  res.status(httpStatus.CREATED).send(article);
});

const tagArticle = catchAsync(async (req, res) => {
  const article = await articleAiService.tagArticle(req.params.articleId);
  res.status(httpStatus.CREATED).send(article);
});

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
