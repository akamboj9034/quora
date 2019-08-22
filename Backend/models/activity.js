var mongoose = require("mongoose");

var activitySchema = mongoose.Schema({

    activity_name: String,

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },

    activity: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },

    onModel: {
        type: String,
        required: true,
        enum: ['questions', 'answers', 'users', 'comments', 'topics']
    },

    date: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('activities', activitySchema)
