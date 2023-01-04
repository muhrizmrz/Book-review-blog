const mongoClient = require('mongodb').MongoClient

const state = {
    db: null
}
module.exports.connect = function(done){
    const url = 'mongodb+srv://muhriz:zirhum286@cluster0.4hhp2.mongodb.net/?retryWrites=true&w=majority'
    const dbname = 'Review'
    mongoClient.connect(url,(err,data)=>{
        if(err) done(err)
        state.db=data.db(dbname)
    })
    done()
}

module.exports.get = function(){
    return state.db
}
