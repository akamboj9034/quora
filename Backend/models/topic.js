var mongoose = require("mongoose");

var topicSchema = mongoose.Schema({

    name: String,

    image: String,

    question: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'questions'
        }
    ]

})

module.exports = mongoose.model('topics', topicSchema)