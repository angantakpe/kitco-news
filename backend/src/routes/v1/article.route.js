const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const articleValidation = require('../../validations/article.validation');
const articleController = require('../../controllers/article.controller');

const router = express.Router();

// router
//   .route('/')
//   .post(auth('manageArticles'), validate(articleValidation.createArticle), articleController.createArticle)
//   .get(auth('getArticles'), validate(articleValidation.getArticles), articleController.getArticles);

// router
//   .route('/:articleId')
//   .get(auth('getArticles'), validate(articleValidation.getArticle), articleController.getArticle)
//   .patch(auth('manageArticles'), validate(articleValidation.updateArticle), articleController.updateArticle)
//   .delete(auth('manageArticles'), validate(articleValidation.deleteArticle), articleController.deleteArticle);

router
  .route('/')
  .post(validate(articleValidation.createArticle), articleController.createArticle)
  .get(validate(articleValidation.getArticles), articleController.getArticles);

router
  .route('/:articleId')
  .get(validate(articleValidation.getArticle), articleController.getArticle)
  .patch(validate(articleValidation.updateArticle), articleController.updateArticle)
  .delete(validate(articleValidation.deleteArticle), articleController.deleteArticle);

router.route('/:articleId/generate').post(validate(articleValidation.generateArticle), articleController.generateArticle);
router.route('/:articleId/translate').post(validate(articleValidation.translateArticle), articleController.translateArticle);
router.route('/:articleId/summarize').post(validate(articleValidation.summarizeArticle), articleController.summarizeArticle);
router.route('/:articleId/tag').post(validate(articleValidation.tagArticle), articleController.tagArticle);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Article management and retrieval
 */

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Create an article
 *     description: Only admins can create other articles.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               titleFr:
 *                 type: string
 *               content:
 *                 type: string
 *               contentFr:
 *                 type: string
 *               author:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [mining, crypto]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *               relatedCompanies:
 *                 type: array
 *                 items:
 *                   type: string
 *               marketData:
 *                 type: object
 *                 properties:
 *                   price:
 *                     type: number
 *                   marketCap:
 *                     type: number
 *                   change24h:
 *                     type: number
 *               summary:
 *                 type: string
 *             example:
 *               title: fake title
 *               titleFr: fake titleFr
 *               content: fake content
 *               contentFr: fake contentFr
 *               category: mining
 *               tags: [tag1, tag2]
 *               status: draft
 *               relatedCompanies: [company1, company2]
 *               marketData:
 *                 price: 100
 *                 marketCap: 1000000
 *                 change24h: 10
 *               summary: fake summary
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Article'
 *       "400":
 *         $ref: '#/components/responses/DuplicateTitle'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all articles
 *     description: Only admins can retrieve all articles.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Article title
 *       - in: query
 *         name: titleFr
 *         schema:
 *           type: string
 *         description: Article title in French
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: Article content
 *       - in: query
 *         name: contentFr
 *         schema:
 *           type: string
 *         description: Article content in French
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Article author
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. title:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of articles
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Get an article
 *     description: Logged in users can fetch only their own article information. Only admins can fetch other articles.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Article'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update an article
 *     description: Logged in users can only update their own information. Only admins can update other articles.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *             example:
 *               title: fake title
 *               content: fake content
 *               author: fake author
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Article'
 *       "400":
 *         $ref: '#/components/responses/DuplicateTitle'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete an article
 *     description: Logged in users can delete only themselves. Only admins can delete other articles.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /articles/generate:
 *   post:
 *     summary: Generate an article using AI
 *     description: Only admins can generate articles.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: language
 *         required: true
 *         schema:
 *           type: string
 *         description: Language of the article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pressRelease:
 *                 type: string
 *               language:
 *                 type: string
 *             example:
 *               pressRelease: fake press release
 *               language: english
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Article'
 */

/**
 * @swagger
 * /articles/{id}/translate:
 *   post:
 *     summary: Translate an article using AI
 *     description: Only admins can translate articles.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: string
 *             example:
 *               articleId: "67919607ae8ee60881b8790c"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Article'
 */

/**
 * @swagger
 * /articles/{id}/summarize:
 *   post:
 *     summary: Summarize an article using AI
 *     description: Only admins can summarize articles.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: string
 *             example:
 *               articleId: "67919607ae8ee60881b8790c"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Article'
 */

/**
 * @swagger
 * /articles/{id}/tag:
 *   post:
 *     summary: Generate tags for an article using AI
 *     description: Only admins can generate tags for articles.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: string
 *             example:
 *               articleId: "67919607ae8ee60881b8790c"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Article'
 */
