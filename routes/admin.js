var express = require('express');
const collection = require('../confiq/collection');
var router = express.Router();
const fs = require('fs')
const db = require('../confiq/connection')
const objectId = require('mongodb').ObjectId

var add_review = require('../helpers/review_models');

var currentUrl = '/admin'
function authorizeAdmin(req,res,next){
  if(req.session.username){
    next()
  }else{
    currentUrl = req.originalUrl
    res.redirect('/admin/login')
  }
}

router.get('/login',(req,res)=>{
  if(req.session.username){
    res.redirect('/admin')
  }else {
    res.render('admin/login')
  }
})

router.post('/login',(req,res)=>{
  if(req.body.username == process.env.ADMIN_USERNAME && req.body.password == process.env.ADMIN_PASSWORD){
    req.session.username = req.body.username
    res.redirect(currentUrl)
  }else {
    res.render('admin/login',{errorMsg:"Username or password is incorrect"})
  }
})

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/admin/login')
})

/* GET home page. */
router.get('/',authorizeAdmin, async(req, res) =>{
  let reviews = await db.get().collection(collection.REVIEW_COLLECTION).find().sort({date:-1}).toArray()
  res.render('admin/home',{reviews:reviews})
});

/* GET new article form. */
router.get('/add-review',authorizeAdmin,(req,res)=>{
  res.render('admin/add_review')
})

/* POST new article */
router.post('/add-review',authorizeAdmin,(req,res)=>{
  add_review.addReview(req.body).then((result)=>{
    if(req.files.image){
      let image  = req.files.image
      image.mv('public/review-images/'+result.insertedId.toString()+'.jpg',(err,done)=>{
        if(!err){
          console.log()  
        }else{
          console.log(err) 
        }
      })
    }
    res.redirect('/admin')
  })
})

/* GET view article */
router.get('/:id',authorizeAdmin,async(req,res)=>{
  var reviewToBeView = await db.get().collection(collection.REVIEW_COLLECTION).findOne({_id:objectId(req.params.id)})
  res.render('admin/view-review',{review:reviewToBeView})
})

/* GET edit aritcle page */
router.get('/edit/:id',authorizeAdmin,async(req,res)=>{
  var _id = req.params.id
  let reviewToBeEdit = await db.get().collection(collection.REVIEW_COLLECTION).findOne({_id:objectId(_id)})
  res.render('admin/edit_review',{review:reviewToBeEdit})
})

/* POST edit article */

router.post('/edit/:id',authorizeAdmin,(req,res)=>{
  add_review.updateReview(req.params.id,req.body).then(()=>{
    var path = 'public/review-images/'+req.params.id+'.jpg'
    if(req.files){
      fs.unlink(path, function (err) {
        err ? console.error(err) : console.log("File removed:", path)
      });
      let editedImage = req.files.image
      editedImage.mv('public/review-images/'+req.params.id+'.jpg')
    }
    res.redirect('/admin/'+req.params.id)
  })
})

router.get('/delete/:id',authorizeAdmin,(req,res)=>{
  add_review.deleteArticle(req.params.id).then(()=>{
    res.redirect('/admin')
  })
})

module.exports = router;
