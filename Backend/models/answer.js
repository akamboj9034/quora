var mongoose = require("mongoose");

var answerSchema = mongoose.Schema({

	question: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'questions'
	},

	answer: String,

	answer_owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users'
	},

	image: String,

	anonymous: {
		isAnonymous: Boolean,
		link: String
	},

	upvote: Number,

	downvote: Number,

	bookmark: Number,

	comment: [
		{

			type: mongoose.Schema.Types.ObjectId,
			ref: 'comments'
		}
	],

	date: {
		type: Date,
		default: Date.now
	},

	view : Number

})

module.exports = mongoose.model('answers', answerSchema)