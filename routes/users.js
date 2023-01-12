var express = require('express');
var router = express.Router();
var review_helper = require('../helpers/review_models')
const collection = require('../confiq/collection');
const db = require('../confiq/connection')
const objectId = require('mongodb').ObjectId

/* GET users listing. */
router.get('/', async (req, res) => {
  let reviewss = await db.get().collection(collection.REVIEW_COLLECTION).find().sort({date:-1}).toArray()
  reviewss.shift()
  let coverReview = await db.get().collection(collection.REVIEW_COLLECTION).find({}).sort({date:-1}).toArray()
  review_helper.getRecentArticles().then((result) => {
    res.render('index', { recentArticles: result, coverReview: coverReview,reviews: reviewss })
  })
});

/* GET view article */
router.get('/reviews/:id', async (req, res) => {
  var reviewToBeView = await db.get().collection(collection.REVIEW_COLLECTION).findOne({ _id: objectId(req.params.id) })
  sameTagArticles = await db.get().collection(collection.REVIEW_COLLECTION).find().toArray()
  for (var i = 0; i < sameTagArticles.length; i++) {
    if (sameTagArticles[i]._id === req.params.id) {
      sameTagArticles.splice(i, 1);
    } else {
      console.log(req.params.id + sameTagArticles[i]._id)
    }
  }
  let updatedSameTagArticles = sameTagArticles.filter(item => item._id !== objectId(req.params.id))
  res.render('view-review', { reviews: reviewToBeView, sameTagArticles: updatedSameTagArticles, currentArticle: req.params.id })
})


/* GET view All */
router.get('/view-all/:catagory', async (req, res) => {
  let viewAll = await db.get().collection(collection.REVIEW_COLLECTION).find({ catagory: req.params.catagory }).toArray()
  res.render('view-all', { allArticle: viewAll })
})

module.exports = router;
