var mongoose = require("mongoose");

var userSchema = mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },

    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    image: String,

    city: String,

    state: String,

    zipcode: String,

    education: [
        {
            school: String,
            concentration: String,
            degree: String,
            graduation_year: Number
        }
    ],

    career: [
        {
            position: String,
            company: String,
            start_year: Number,
            end_year: Number,
            current: Boolean
        }
    ],

    description: String,

    credential: String,

    topic: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'topics'
        }
    ],

    question: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'questions'
        }
    ],

    answer: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'answers'
        }
    ],

    upvote: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'answers'
        }
    ],

    downvote: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'answers'
        }
    ],

    bookmark: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'answers'
        }
    ],

    follower: [this],

    following: [this],

    followed_question: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'questions'
        }
    ],

    isDeactivated: {
        type: Boolean,
        default: false
    },

    view: [{
        count: Number,
        date: {
            type: Date,
            default: Date.now
        }
    }]


})

module.exports = mongoose.model('users', userSchema)