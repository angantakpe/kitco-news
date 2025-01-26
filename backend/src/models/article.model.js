const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { number } = require('joi');

const articleSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    titleFr: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    contentFr: {
      type: String,
      trim: true,
    },
    summaryFr: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
      enum: ['mining', 'crypto'],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    relatedCompanies: {
      type: [String],
      default: [],
    },
    marketData: {
      type: Object,
      default: {
        price: Number,
        marketCap: Number,
        change24h: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
articleSchema.plugin(toJSON);
articleSchema.plugin(paginate);

/**
 * Check if title is taken
 * @param {string} title - The article's title
 * @param {ObjectId} [excludeArticleId] - The id of the article to be excluded
 * @returns {Promise<boolean>}
 */
articleSchema.statics.isTitleTaken = async function (title, excludeArticleId) {
  const article = await this.findOne({ title, _id: { $ne: excludeArticleId } });
  return !!article;
};

/**
 * @typedef Article
 */

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
