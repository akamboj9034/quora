var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({

    comment: String,
    
    comment_owner: {
        type: mongoose.Schema.Types.ObjectId,
		ref: 'users'
    },

    answer:{
        type: mongoose.Schema.Types.ObjectId,
		ref: 'answers'
    },

    date: {
        type: Date,
        default: Date.now
    }
    
})

module.exports = mongoose.model('comments', commentSchema)