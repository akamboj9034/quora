var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var User = require('../models/user');
var Topic = require('../models/topic');
var Question = require('../models/question');
var Message = require('../models/message');
var mysql = require('mysql');
var pool = require('../connections/mysql');
var cookieParser = require('cookie-parser');

// posting a message
// router.post("/", function (req, res, next) {

//     let from = req.body.from;
//     let to = req.body.to;
//     let message = req.body.message;

//     var message = new MessageChannel({
//         from: from,
//         to: to,
//         message: message
//     })

//     console.log(message);

//     User.find({ _id: to, isDeactivated: false }).exec()
//         .then(result1 => {
//             if (result1) {
//                 console.log("User found successfully..");
//                 message.save()
//                     .then(result2 => {
//                         res.writeHead(200, {
//                             'Content-Type': 'application/json'
//                         })

//                         const resp = {
//                             "status": 1,
//                             "msg": "Message added successfully",
//                             "data": {}
//                         }

//                         res.end(JSON.stringify(resp));
//                     })
//                     .catch(err => {
//                         console.log(err);
//                         res.writeHead(200, {
//                             'Content-Type': 'appliction/json'
//                         })

//                         const resp = {
//                             "status": 0,
//                             "msg": "User not found",
//                             "data": {}
//                         }

//                         res.end(JSON.stringify(resp));
//                     })
//             }
//             else {
//                 console.log("User not found (deactivated)");

//                 res.writeHead(200, {
//                     'Content-Type': 'application/json'
//                 })

//                 const resp = {
//                     "status": 1,
//                     "msg": "User is not found, may be deactivated.",
//                     "data": {}
//                 }

//                 res.end(JSON.stringify(resp));
//             }
//         })
//         .catch(err => {
//             console.log(err);
//             res.writeHead(200, {
//                 'Content-Type': 'application/json'
//             })

//             const resp = {
//                 "status": 0,
//                 "msg": "Cannot find query",
//                 "data": {}
//             }

//             res.end(JSON.stringify(resp));
//         })
// })

//New Conversation
router.post("/", async function (req, res, next) {

    const data = {
        members: [req.body.user_id, req.body.to],
        sentBy: req.body.user_id,
        body: req.body.body
    }
    console.log(data.members)

    User.findById(data.sentBy, { '_id': 0, 'firstname': 1, 'lastname': 1, 'image': 1 }).exec()
        .then(user_result => {
            const messageContent = {
                sentBy: user_result.firstname + " " + user_result.lastname,
                body: data.body
            }
            Message.findOne({
                members: { $all: data.members }
            }).exec()
                .then(result => {
                    // console.log(result)
                    if (result && result.length != 0) {
                        Message.findByIdAndUpdate(result._id, {
                            $push: {
                                messages: messageContent
                            }
                        }).exec()
                            .then(result => {
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                })
                                const resp = {
                                    "status": 1,
                                    "msg": "Message Sent",
                                    "data": {}
                                }
                                res.end(JSON.stringify(resp))
                            })
                            .catch(err => {
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                })
                                const resp = {
                                    "status": 0,
                                    "msg": "Something went wrong",
                                    "data": {}
                                }
                                res.end(JSON.stringify(resp))
                            })
                    } else {
                        var message = new Message({
                            members: data.members,
                            messages: messageContent
                        })
                        message.save()
                            .then(result => {
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                })
                                const resp = {
                                    "status": 1,
                                    "msg": "Message Sent",
                                    "data": {}
                                }
                                res.end(JSON.stringify(resp))
                            })
                            .catch(err => {
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                })
                                const resp = {
                                    "status": 0,
                                    "msg": "Something went wrong",
                                    "data": {}
                                }
                                res.end(JSON.stringify(resp))
                            })
                    }
                })
                .catch(err => {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    const resp = {
                        "status": 0,
                        "msg": "Something went wrong",
                        "data": {}
                    }
                    res.end(JSON.stringify(resp))
                })

        })
        .catch(err => {
            console.log("Server Error")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 0,
                "msg": "Something went wrong",
                "data": {}
            }
            res.end(JSON.stringify(resp))
        })

})


//Existing
router.put("/:conversation_id", async function (req, res, next) {

    console.log("updating messages of: ", req.params.conversation_id)
    const data = {
        conversation_id: req.params.conversation_id,
        sentBy: req.body.user_id,
        body: req.body.body
    }

    User.findById(data.sentBy, { '_id': 0, 'firstname': 1, 'lastname': 1, 'image': 1 }).exec()
        .then(user_result => {
            const messageContent = {
                sentBy: user_result.firstname + " " + user_result.lastname,
                body: data.body
            }

            Message.findByIdAndUpdate(data.conversation_id, {
                $push: {
                    messages: messageContent
                }
            }).exec()
                .then(result => {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    const resp = {
                        "status": 1,
                        "msg": "Message Sent",
                        "data": {}
                    }
                    res.end(JSON.stringify(resp))
                })
                .catch(err => {
                    console.log("Server Error")
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    const resp = {
                        "status": 0,
                        "msg": "Something went wrong",
                        "data": {}
                    }
                    res.end(JSON.stringify(resp))
                })
        })
        .catch(err => {
            console.log("Server Error")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 0,
                "msg": "Something went wrong",
                "data": {}
            }
            res.end(JSON.stringify(resp))
        })
})


//Search People
router.get("/search", function (req, res, next) {
    let q = req.query.q
    console.log(q)

    User.find({ firstname: { $regex: q, $options: "x" }, isDeactivated: "false" }).select('firstname lastname image').limit(5).exec()
        .then(user_result => {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "Searched Successfully",
                "data": user_result
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
                "msg": "cannot search",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})


//Getting Conversation
router.get("/:conversation_id", async function (req, res, next) {

    console.log("Getting messages of: ", req.params.conversation_id)


    Message.findById(req.params.conversation_id).exec()
        .then(result => {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "Message Sent",
                "data": result
            }
            res.end(JSON.stringify(resp))
        })
        .catch(err => {
            console.log("Server Error")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 0,
                "msg": "Something went wrong",
                "data": {}
            }
            res.end(JSON.stringify(resp))
        })

})




module.exports = router;
