var mongoose = require("mongoose");

var questionSchema = mongoose.Schema({

    question: String,

    question_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },

    topic: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'topics'
        }
    ],

    follower: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],

    answer: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'answers'
        }
    ],

    date: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('questions', questionSchema)
