var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var User = require('../models/user')
var Topic = require('../models/topic')
var Question = require('../models/question')
var Answer = require('../models/answer')
var Activity = require('../models/activity')
var mysql = require('mysql')
var pool = require('../connections/mysql')
var cookieParser = require('cookie-parser');

router.use(cookieParser())

//Posting a Question
router.post("/", function (req, res, next) {

    let question_owner = req.body.question_owner
    let question_name = req.body.question
    let topic = req.body.topic

    var question = new Question({
        question_owner: req.body.question_owner,
        question: question_name,
        topic: req.body.topic
    })
    console.log(question)

    question.save()
        .then(result => {
            User.findByIdAndUpdate(question_owner, { $push: { question: result._id } }).exec()
                .then(async result2 => {
                    console.log("topicsssss", topic)
                    for (let i = 0; i < topic.length; i++) {
                        await Topic.findOneAndUpdate({ _id: topic[i] }, { $push: { question: result._id } }).exec()
                            .then(result3 => {
                                console.log("Question Adding in topic", topic)
                            })
                            .catch(err => {
                                console.log(err)
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                })
                                const resp = {
                                    "status": 0,
                                    "msg": "cannot update topics",
                                    "data": {}
                                }
                                res.end(JSON.stringify(resp));
                            })
                    }

                    var activity = new Activity({
                        user: question_owner,
                        activity_name: "Posted a question",
                        activity: result._id,
                        onModel: "questions"
                    })
                    activity.save()
                        .then(resultTest => {

                            res.writeHead(200, {
                                'Content-Type': 'application/json'
                            })
                            const resp = {
                                "status": 1,
                                "msg": "Question Added Successfully",
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
                "msg": "cannot insert question",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

//Get Particular Question
router.get("/:question_id", function (req, res) {
    console.log("getting Question")
    let question_id = req.params.question_id
    Question.findById(question_id).populate([{path: 'topic follower question_owner'},
        {path: 'answer', populate:
            [{path: 'comment', populate: {path: 'comment_owner', select: 'firstname lastname image description'}},
                {path: 'answer_owner', select: 'firstname lastname image description'}]}] ).exec()
        .then(result => {
            console.log("Extracting Question: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "Question fetched successfully",
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
                "msg": "Cannot fetch question",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

//Follow Particular Question
router.put("/:question_id/follow", function (req, res) {
    console.log("getting Question")
    let question_id = req.params.question_id
    let user_id = req.body.user_id
    User.findByIdAndUpdate(user_id, { $push: { followed_question: question_id } }).exec()
        .then(result1 => {
            Question.findByIdAndUpdate(question_id, { $push: { follower: user_id } }, { new: true }).exec()
                .then(result2 => {

                    var activity = new Activity({
                        user: user_id,
                        activity_name: "Followed a question",
                        activity: question_id,
                        onModel: "questions"
                    })
                    activity.save()
                        .then(resultTest => {

                            console.log("Following a Question: ")
                            res.writeHead(200, {
                                'Content-Type': 'application/json'
                            })
                            const resp = {
                                "status": 1,
                                "msg": "Question followed successfully",
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
                                "msg": "Cannot update question's follower",
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
                        "msg": "Cannot update followed questions",
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
                "msg": "Cannot update question's follower",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })

})

//Unfollow Particular Question
router.put("/:question_id/unfollow", function (req, res) {
    console.log("getting Question")
    let question_id = req.params.question_id
    let user_id = req.body.user_id
    User.findByIdAndUpdate(user_id, { $pull: { followed_question: question_id } }).exec()
        .then(result1 => {
            Question.findByIdAndUpdate(question_id, { $pull: { follower: user_id } }, { new: true }).exec()
                .then(result2 => {
                    console.log("Following a Question: ")
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    const resp = {
                        "status": 1,
                        "msg": "Question unfollowed successfully",
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
                        "msg": "Cannot update question's follower",
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
                "msg": "Cannot update followed questions",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

//Posting a Question
router.post("/activityTest", function (req, res, next) {

    let question_owner = req.body.question_owner
    let question_name = req.body.question
    let topic = req.body.topic

    var question = new Question({
        question_owner: req.body.question_owner,
        question: question_name,
        topic: req.body.topic
    })

    console.log(question)

    question.save()
        .then(result => {
            User.findByIdAndUpdate(question_owner, { $push: { question: result._id } }).exec()
                .then(result2 => {
                    var activity = new Activity({
                        user: req.body.question_owner,
                        activity_name: "Asked a Question",
                        activity: result._id,
                        onModel: "questions"
                    })
                    activity.save()
                        .then(resultTest => {
                            res.writeHead(200, {
                                'Content-Type': 'application/json'
                            })
                            const resp = {
                                "status": 1,
                                "msg": "Question Added Successfully",
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
                "msg": "cannot insert question",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

//Get Particular Question
router.get("/:user_id/activities", function (req, res) {
    console.log("getting Question")

    Activity.find({ user: req.params.user_id }).populate('activity').exec()
        .then(result => {
            console.log("Extracting Question: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "Question fetched successfully",
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
                "msg": "Cannot fetch question",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

//Posting an Answer
router.post("/answer", function (req, res, next) {

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
                                user: req.body.answer_owner,
                                name: "Answer a Question",
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

module.exports = router;
