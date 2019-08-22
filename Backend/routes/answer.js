var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var User = require('../models/user')
var Topic = require('../models/topic')
var Question = require('../models/question')
var Answer = require('../models/answer')
var Comment = require('../models/comment')
var Activity = require('../models/activity')
var mysql = require('mysql')
var pool = require('../connections/mysql')
var cookieParser = require('cookie-parser');

router.use(cookieParser())

//Posting an Answer
router.post("/", function (req, res, next) {

    let answer_owner = req.body.answer_owner
    let answer_name = req.body.answer
    let question = req.body.question_id

    var answer = new Answer({
        answer_owner: req.body.answer_owner,
        answer: answer_name,
        question: question
    })
    console.log(answer)
    answer.save()
        .then(result => {
            User.findByIdAndUpdate(answer_owner, { $push: { answer: result._id } }).exec()
                .then(result2 => {
                    Question.findOneAndUpdate({ _id: question }, { $push: { answer: result._id } }).exec()
                        .then(result3 => {

                            var activity = new Activity({
                                user: answer_owner,
                                activity_name: "Posted an answer",
                                activity: result._id,
                                onModel: "answers"
                            })
                            activity.save()
                                .then(resultTest => {

                                    console.log("Answer adding in the question")
                                    res.writeHead(200, {
                                        'Content-Type': 'application/json'
                                    })
                                    const resp = {
                                        "status": 1,
                                        "msg": "Answer Added Successfully",
                                        "data": {}
                                    }
                                    res.end(JSON.stringify(resp));
                                })
                                .catch(err => {
                                    console.log(err)
                                    res.writeHead(200, {
                                        'Content-Type': 'application/json'
                                    })
                                    const resp = {
                                        "status": 0,
                                        "msg": "cannot update question",
                                        "data": {}
                                    }
                                    res.end(JSON.stringify(resp));
                                })
                        })
                        .catch(err => {
                            console.log(err)
                            res.writeHead(200, {
                                'Content-Type': 'application/json'
                            })
                            const resp = {
                                "status": 0,
                                "msg": "cannot update user",
                                "data": {}
                            }
                            res.end(JSON.stringify(resp));
                        })
                })
                .catch(err => {
                    console.log(err)
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    const resp = {
                        "status": 0,
                        "msg": "cannot insert answer",
                        "data": {}
                    }
                    res.end(JSON.stringify(resp));
                })
        })
        .catch(err => {
            console.log(err)
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 0,
                "msg": "cannot update question",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

//Editing an Answer
router.put("/:answer_id", function (req, res, next) {

    let answer_name = req.body.answer
    let answer_id = req.params.answer_id

    Answer.findByIdAndUpdate(answer_id, { $set: { answer: answer_name } }).select('answer').exec()
        .then(result => {
            console.log("Answer editing in the question")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "Answer Edited Successfully",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
        .catch(err => {
            console.log(err)
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 0,
                "msg": "cannot edit answer",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})


//Get Particular Answer
router.get("/:answer_id", function (req, res) {
    console.log("getting Answer")
    let answer_id = req.params.answer_id
    Answer.findById(answer_id).populate([{ path: 'question answer_owner' }, { path: 'comment', populate: { path: 'comment_owner', select: 'firstname lastname image description' } }]).exec()
        .then(result => {
            Answer.findByIdAndUpdate(answer_id, { $inc: { view: 1 } }, { new: true }).select('view').exec()
                .then(result_view => {
                    console.log("Extracting Answer: ")
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    const resp = {
                        "status": 1,
                        "msg": "Answer fetched successfully",
                        "data": result
                    }
                    res.end(JSON.stringify(resp));
                })
                .catch(err => {
                    console.log(err)
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    const resp = {
                        "status": 0,
                        "msg": "Cannot fetch answer",
                        "data": {}
                    }
                    res.end(JSON.stringify(resp));
                })
        })
        .catch(err => {
            console.log(err)
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 0,
                "msg": "Cannot fetch answer",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })

})

//Upvote an answer
router.put("/:answer_id/upvote", function (req, res) {
    console.log("Upvoting")
    let answer_id = req.params.answer_id
    let user_id = req.body.user_id
    User.findById(user_id).select('downvote upvote').exec()
        .then(result1 => {
            let upvotes = result1.upvote.toString()
            let downvotes = result1.downvote.toString()
            if (upvotes.includes(answer_id)) {
                console.log("if")
                User.findByIdAndUpdate(user_id, { $pull: { upvote: answer_id } }, { new: true }).exec()
                    .then(result2 => {
                        Answer.findByIdAndUpdate(answer_id, { $inc: { upvote: -1 } }).exec()
                            .then(result3 => {

                                console.log("Removing upvote: ")
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                })
                                const resp = {
                                    "status": 1,
                                    "msg": "Answer removed from upvote successfully",
                                    "data": result2
                                }
                                res.end(JSON.stringify(resp));
                            })
                            .catch(err => {
                                console.log(err)
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                })
                                const resp = {
                                    "status": 0,
                                    "msg": "Cannot decrease answer's upvote count",
                                    "data": {}
                                }
                                res.end(JSON.stringify(resp));
                            })


                    })
                    .catch(err => {
                        console.log(err)
                        res.writeHead(200, {
                            'Content-Type': 'application/json'
                        })
                        const resp = {
                            "status": 0,
                            "msg": "Cannot decrease answer's upvote count",
                            "data": {}
                        }
                        res.end(JSON.stringify(resp));
                    })
            } else if (downvotes.includes(answer_id)) {
                console.log("else if")
                User.findByIdAndUpdate(user_id, { $pull: { downvote: answer_id } }).exec()
                    .then(result4 => {
                        Answer.findByIdAndUpdate(answer_id, { $inc: { downvote: -1 } }).exec()
                            .then(result5 => {
                                User.findByIdAndUpdate(user_id, { $push: { upvote: answer_id } }, { new: true }).exec()
                                    .then(result6 => {
                                        Answer.findByIdAndUpdate(answer_id, { $inc: { upvote: 1 } }).exec()
                                            .then(result7 => {

                                                var activity = new Activity({
                                                    user: user_id,
                                                    activity_name: "Upvoted an answer",
                                                    activity: answer_id,
                                                    onModel: "answers"
                                                })
                                                activity.save()
                                                    .then(resultTest => {


                                                        console.log("Upvoting an answer: ")
                                                        res.writeHead(200, {
                                                            'Content-Type': 'application/json'
                                                        })
                                                        const resp = {
                                                            "status": 1,
                                                            "msg": "Answer upvoted successfully",
                                                            "data": result6
                                                        }
                                                        res.end(JSON.stringify(resp));
                                                    })
                                                    .catch(err => {
                                                        console.log(err)
                                                        res.writeHead(200, {
                                                            'Content-Type': 'application/json'
                                                        })
                                                        const resp = {
                                                            "status": 0,
                                                            "msg": "Cannot update answer's upvote count",
                                                            "data": {}
                                                        }
                                                        res.end(JSON.stringify(resp));
                                                    })
                                            })
                                            .catch(err => {
                                                console.log(err)
                                                res.writeHead(200, {
                                                    'Content-Type': 'application/json'
                                                })
                                                const resp = {
                                                    "status": 0,
                                                    "msg": "Cannot update upvoted answers",
                                                    "data": {}
                                                }
                                                res.end(JSON.stringify(resp));
                                            })
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        res.writeHead(200, {
                                            'Content-Type': 'application/json'
                                        })
                                        const resp = {
                                            "status": 0,
                                            "msg": "Cannot update answer's downvote count",
                                            "data": {}
                                        }
                                        res.end(JSON.stringify(resp));
                                    })
                            })
                            .catch(err => {
                                console.log(err)
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                })
                                const resp = {
                                    "status": 0,
                                    "msg": "Cannot update downvoted answers",
                                    "data": {}
                                }
                                res.end(JSON.stringify(resp));
                            })
                            .catch(err => {
                                console.log(err)
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                })
                                const resp = {
                                    "status": 0,
                                    "msg": "Cannot update downvoted answers",
                                    "data": {}
                                }
                                res.end(JSON.stringify(resp));
                            })

                    })
            } else {
                User.findByIdAndUpdate(user_id, { $push: { upvote: answer_id } }, { new: true }).exec()
                    .then(result8 => {
                        Answer.findByIdAndUpdate(answer_id, { $inc: { upvote: 1 } }).exec()
                            .then(result9 => {

                                var activity = new Activity({
                                    user: user_id,
                                    activity_name: "Upvoted an answer",
                                    activity: answer_id,
                                    onModel: "answers"
                                })
                                activity.save()
                                    .then(resultTest => {

                                        console.log("Upvoting an answer: ")
                                        res.writeHead(200, {
                                            'Content-Type': 'application/json'
                                        })
                                        const resp = {
                                            "status": 1,
                                            "msg": "Answer upvoted successfully",
                                            "data": result8
                                        }
                                        res.end(JSON.stringify(resp));
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        res.writeHead(200, {
                                            'Content-Type': 'application/json'
                                        })
                                        const resp = {
                                            "status": 0,
                                            "msg": "Cannot update answer's upvote count",
                                            "data": {}
                                        }
                                        res.end(JSON.stringify(resp));
                                    })
                            })
                            .catch(err => {
                                console.log(err)
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                })
                                const resp = {
                                    "status": 0,
                                    "msg": "Cannot update upvoted answers",
                                    "data": {}
                                }
                                res.end(JSON.stringify(resp));
                            })

                    })
                    .catch(err => {
                        console.log(err)
                        res.writeHead(200, {
                            'Content-Type': 'application/json'
                        })
                        const resp = {
                            "status": 0,
                            "msg": "Cannot update upvoted answers",
                            "data": {}
                        }
                        res.end(JSON.stringify(resp));
                    })

            }
        })
        .catch(err => {
            console.log(err)
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 0,
                "msg": "Cannot get upvoted and downvoted answers",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

//Downvote an asnwer
router.put("/:answer_id/downvote", function (req, res) {
    console.log("Downvoting")
    let answer_id = req.params.answer_id
    let user_id = req.body.user_id
    User.findById(user_id).select('upvote downvote').exec()
        .then(result1 => {
            let upvotes = result1.upvote.toString()
            let downvotes = result1.downvote.toString()
            if (downvotes.includes(answer_id)) {
                User.findByIdAndUpdate(user_id, { $pull: { downvote: answer_id } }, { new: true }).exec()
                    .then(result2 => {
                        Answer.findByIdAndUpdate(answer_id, { $inc: { downvote: -1 } }).exec()
                            .then(result3 => {

                                console.log("Removing Downvote: ")
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                })
                                const resp = {
                                    "status": 1,
                                    "msg": "Answer removed from downvote successfully",
                                    "data": result2
                                }
                                res.end(JSON.stringify(resp));
                            })
                            .catch(err => {
                                console.log(err)
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                })
                                const resp = {
                                    "status": 0,
                                    "msg": "Cannot decrease answer's downvote count",
                                    "data": {}
                                }
                                res.end(JSON.stringify(resp));
                            })

                    })
                    .catch(err => {
                        console.log(err)
                        res.writeHead(200, {
                            'Content-Type': 'application/json'
                        })
                        const resp = {
                            "status": 0,
                            "msg": "Cannot remove from downvoted answers",
                            "data": {}
                        }
                        res.end(JSON.stringify(resp));
                    })

            } else if (upvotes.includes(answer_id)) {
                User.findByIdAndUpdate(user_id, { $pull: { upvote: answer_id } }).exec()
                    .then(result4 => {
                        Answer.findByIdAndUpdate(answer_id, { $inc: { upvote: -1 } }).exec()
                            .then(result5 => {
                                User.findByIdAndUpdate(user_id, { $push: { downvote: answer_id } }, { new: true }).exec()
                                    .then(result6 => {
                                        Answer.findByIdAndUpdate(answer_id, { $inc: { downvote: 1 } }).exec()
                                            .then(result7 => {


                                                var activity = new Activity({
                                                    user: user_id,
                                                    activity_name: "Downvoted an answer",
                                                    activity: answer_id,
                                                    onModel: "answers"
                                                })
                                                activity.save()
                                                    .then(resultTest => {




                                                        console.log("Downvoting an answer: ")
                                                        res.writeHead(200, {
                                                            'Content-Type': 'application/json'
                                                        })
                                                        const resp = {
                                                            "status": 1,
                                                            "msg": "Answer downvoted successfully",
                                                            "data": result6
                                                        }
                                                        res.end(JSON.stringify(resp));
                                                    })
                                                    .catch(err => {
                                                        console.log(err)
                                                        res.writeHead(200, {
                                                            'Content-Type': 'application/json'
                                                        })
                                                        const resp = {
                                                            "status": 0,
                                                            "msg": "Cannot increase answer's downvote count",
                                                            "data": {}
                                                        }
                                                        res.end(JSON.stringify(resp));
                                                    })
                                            })
                                            .catch(err => {
                                                console.log(err)
                                                res.writeHead(200, {
                                                    'Content-Type': 'application/json'
                                                })
                                                const resp = {
                                                    "status": 0,
                                                    "msg": "Cannot increase answer's downvote count",
                                                    "data": {}
                                                }
                                                res.end(JSON.stringify(resp));
                                            })
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        res.writeHead(200, {
                                            'Content-Type': 'application/json'
                                        })
                                        const resp = {
                                            "status": 0,
                                            "msg": "Cannot add to downvoted answers",
                                            "data": {}
                                        }
                                        res.end(JSON.stringify(resp));
                                    })
                            })
                            .catch(err => {
                                console.log(err)
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                })
                                const resp = {
                                    "status": 0,
                                    "msg": "Cannot decrease answer's upvote count",
                                    "data": {}
                                }
                                res.end(JSON.stringify(resp));
                            })
                    })
                    .catch(err => {
                        console.log(err)
                        res.writeHead(200, {
                            'Content-Type': 'application/json'
                        })
                        const resp = {
                            "status": 0,
                            "msg": "Cannot remove from upvoted answers",
                            "data": {}
                        }
                        res.end(JSON.stringify(resp));
                    })
            } else {
                User.findByIdAndUpdate(user_id, { $push: { downvote: answer_id } }, { new: true }).exec()
                    .then(result8 => {
                        Answer.findByIdAndUpdate(answer_id, { $inc: { downvote: 1 } }).exec()
                            .then(result9 => {
                                var activity = new Activity({
                                    user: user_id,
                                    activity_name: "Downvoted an answer",
                                    activity: answer_id,
                                    onModel: "answers"
                                })
                                activity.save()
                                    .then(resultTest => {


                                        console.log("Downvoting an answer: ")
                                        res.writeHead(200, {
                                            'Content-Type': 'application/json'
                                        })
                                        const resp = {
                                            "status": 1,
                                            "msg": "Answer downvoted successfully",
                                            "data": result8
                                        }
                                        res.end(JSON.stringify(resp));
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        res.writeHead(200, {
                                            'Content-Type': 'application/json'
                                        })
                                        const resp = {
                                            "status": 0,
                                            "msg": "Cannot increase answer's downvote count",
                                            "data": {}
                                        }
                                        res.end(JSON.stringify(resp));
                                    })
                            })
                            .catch(err => {
                                console.log(err)
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                })
                                const resp = {
                                    "status": 0,
                                    "msg": "Cannot add to downvoted answers",
                                    "data": {}
                                }
                                res.end(JSON.stringify(resp));
                            })
                    })
                    .catch(err => {
                        console.log(err)
                        res.writeHead(200, {
                            'Content-Type': 'application/json'
                        })
                        const resp = {
                            "status": 0,
                            "msg": "Cannot add to downvoted answers",
                            "data": {}
                        }
                        res.end(JSON.stringify(resp));
                    })
            }
        })
        .catch(err => {
            console.log(err)
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 0,
                "msg": "Cannot get upvoted and downvoted answers",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

//Bookmark an answer
router.put("/:answer_id/bookmark", function (req, res) {
    console.log("Bookmarking")
    let answer_id = req.params.answer_id
    let user_id = req.body.user_id
    User.findById(user_id).select('bookmark').exec()
        .then(result1 => {
            let bookmark = result1.bookmark.toString()
            if (bookmark.includes(answer_id)) {
                User.findByIdAndUpdate(user_id, { $pull: { bookmark: answer_id } }, { new: true }).exec()
                    .then(result2 => {
                        Answer.findByIdAndUpdate(answer_id, { $inc: { bookmark: -1 } }).exec()
                            .then(result3 => {


                                console.log("Removing bookmark: ")
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                })
                                const resp = {
                                    "status": 1,
                                    "msg": "Answer removed from bookmark successfully",
                                    "data": result2
                                }
                                res.end(JSON.stringify(resp));
                            })
                            .catch(err => {
                                console.log(err)
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                })
                                const resp = {
                                    "status": 0,
                                    "msg": "Cannot decrease answer's bookmark count",
                                    "data": {}
                                }
                                res.end(JSON.stringify(resp));
                            })

                    })
                    .catch(err => {
                        console.log(err)
                        res.writeHead(200, {
                            'Content-Type': 'application/json'
                        })
                        const resp = {
                            "status": 0,
                            "msg": "Cannot remove from bookmarked answers",
                            "data": {}
                        }
                        res.end(JSON.stringify(resp));
                    })
            } else {
                User.findByIdAndUpdate(user_id, { $push: { bookmark: answer_id } }, { new: true }).exec()
                    .then(result8 => {
                        Answer.findByIdAndUpdate(answer_id, { $inc: { bookmark: 1 } }).exec()
                            .then(result9 => {

                                var activity = new Activity({
                                    user: user_id,
                                    activity_name: "Bookmarked an answer",
                                    activity: answer_id,
                                    onModel: "answers"
                                })
                                activity.save()
                                    .then(resultTest => {

                                        console.log("Bookmarking an answer: ")
                                        res.writeHead(200, {
                                            'Content-Type': 'application/json'
                                        })
                                        const resp = {
                                            "status": 1,
                                            "msg": "Answer bookmarked successfully",
                                            "data": result8
                                        }
                                        res.end(JSON.stringify(resp));
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        res.writeHead(200, {
                                            'Content-Type': 'application/json'
                                        })
                                        const resp = {
                                            "status": 0,
                                            "msg": "Cannot increase answer's bookmark count",
                                            "data": {}
                                        }
                                        res.end(JSON.stringify(resp));
                                    })
                            })
                            .catch(err => {
                                console.log(err)
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                })
                                const resp = {
                                    "status": 0,
                                    "msg": "Cannot add to bookmarked answers",
                                    "data": {}
                                }
                                res.end(JSON.stringify(resp));
                            })
                    })
                    .catch(err => {
                        console.log(err)
                        res.writeHead(200, {
                            'Content-Type': 'application/json'
                        })
                        const resp = {
                            "status": 0,
                            "msg": "Cannot add to bookmarked answers",
                            "data": {}
                        }
                        res.end(JSON.stringify(resp));
                    })
            }
        })
        .catch(err => {
            console.log(err)
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 0,
                "msg": "Cannot get bookmarked answers",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

//Commenting an answer
router.post("/:answer_id/comment", function (req, res, next) {

    let comment_owner = req.body.comment_owner
    let answer_id = req.params.answer_id
    let comment_body = req.body.comment

    var comment = new Comment({
        comment_owner: comment_owner,
        answer: answer_id,
        comment: comment_body
    })
    console.log(comment)
    comment.save()
        .then(result => {
            Answer.findByIdAndUpdate(answer_id, { $push: { comment: result._id } }).exec()
                .then(result2 => {

                    var activity = new Activity({
                        user: comment_owner,
                        activity_name: "Commented on an answer",
                        activity: result._id,
                        onModel: "answers"
                    })
                    activity.save()
                        .then(resultTest => {

                            console.log("Comment adding in the answer")
                            res.writeHead(200, {
                                'Content-Type': 'application/json'
                            })
                            const resp = {
                                "status": 1,
                                "msg": "Comment Added Successfully",
                                "data": {}
                            }
                            res.end(JSON.stringify(resp));
                        })
                        .catch(err => {
                            console.log(err)
                            res.writeHead(200, {
                                'Content-Type': 'application/json'
                            })
                            const resp = {
                                "status": 0,
                                "msg": "cannot update answer",
                                "data": {}
                            }
                            res.end(JSON.stringify(resp));
                        })
                })
                .catch(err => {
                    console.log(err)
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    const resp = {
                        "status": 0,
                        "msg": "cannot insert comment",
                        "data": {}
                    }
                    res.end(JSON.stringify(resp));
                })

        })
        .catch(err => {
            console.log(err)
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 0,
                "msg": "cannot insert comment",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})


//Posting an Answer anonymously
router.post("/anonymous", function (req, res, next) {

    let answer_link = req.body.answer_link
    let answer_name = req.body.answer
    let question = req.body.question_id

    var answer = new Answer({
        anonymous: {
            isAnonymous: true,
            link: answer_link
        },
        answer: answer_name,
        question: question
    })
    console.log(answer)
    answer.save()
        .then(result => {
            Question.findOneAndUpdate({ _id: question }, { $push: { answer: result._id } }).exec()
                .then(result3 => {
                    console.log("Answer adding in the question")
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    const resp = {
                        "status": 1,
                        "msg": "Answer Added Successfully",
                        "data": {}
                    }
                    res.end(JSON.stringify(resp));
                })
                .catch(err => {
                    console.log(err)
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    const resp = {
                        "status": 0,
                        "msg": "cannot update question",
                        "data": {}
                    }
                    res.end(JSON.stringify(resp));
                })
        })
        .catch(err => {
            console.log(err)
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 0,
                "msg": "cannot insert answer",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})


module.exports = router;
