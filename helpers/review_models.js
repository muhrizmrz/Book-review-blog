const { reject, resolve } = require('promise')
const db = require('../confiq/connection')
const collection = require('../confiq/collection')
const marked = require('marked')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const { ObjectId } = require('bson')
const dompurify = createDomPurify(new JSDOM().window)

module.exports = {
    addReview:(review)=>{
        return new Promise((resolve,reject)=>{
            review.date = new Date().toISOString().slice(0,10)
            review.markdown = dompurify.sanitize(marked(review.review))

            db.get().collection(collection.REVIEW_COLLECTION).insertOne(review).then((result)=>{
                resolve(result)  
            })
        })
    },
    getRecentArticles:()=>{
        return new Promise(async(resolve,reject)=>{
            let articleDb = await db.get().collection(collection.REVIEW_COLLECTION).find().sort({date:-1}).limit(4).toArray()
            
            console.log(new Date().toISOString().slice(0,10))
            //console.log(articleDb)
            resolve(articleDb)
        })
    },
    updateReview:(review_id,reviewDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.REVIEW_COLLECTION)
            .updateOne({_id:ObjectId(review_id)},{
                $set:{
                  book_name: reviewDetails.book_name, 
                   author: reviewDetails.author,
                   reviewer: reviewDetails.reviewer,
                   review: reviewDetails.review, 
                   catagory: reviewDetails.catagory,
                   markdown: dompurify.sanitize(marked(reviewDetails.review))
                }
            }).then((result)=>{
                resolve(result)
            })
        })
    },
    deleteArticle:(articleId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.REVIEW_COLLECTION).deleteOne({_id:ObjectId(articleId)}).then((result)=>{
                resolve(result)
            })
        })
    }
}