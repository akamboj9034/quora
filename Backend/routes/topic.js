var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var User = require('../models/user')
var Topic = require('../models/topic')
var mysql = require('mysql')
var pool = require('../connections/mysql')
var kafka = require('../kafka/client')
var cookieParser = require('cookie-parser');

router.use(cookieParser())

router.get("/", function (req, res) {
    console.log("getting topics")

    // kafka.make_request("getTopics", null, function (err, result) {
    //     if (err) {
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "Cannot fetch topics",
    //             "data": {}

    //         }
    //         res.end(JSON.stringify(resp));
    //     } else {
    //         console.log("Extracting Topics: ")
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 1,
    //             "msg": "Topics got successfully",
    //             "data": result
    //         }
    //         res.end(JSON.stringify(resp));
    //     }
    // })
    console.log("Line 41")
    Topic.find().exec()
        .then(result => {
            console.log("Extracting Topics: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "Topics got successfully",
                "data": result
            }
            res.end(JSON.stringify(resp));
        })
        .catch(err => {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 0,
                "msg": "Cannot fetch topics",
                "data": {}

            }
            res.end(JSON.stringify(resp));
        })
})

router.get("/:topic_name", function (req, res) {

    console.log("getting topic")
    let topic_name = req.params.topic_name
    console.log(topic_name);
    opic.find({name:topic_name}).populate({path: 'question', populate: {path: 'answer', populate: {path: 'answer_owner comment', populate: {path: 'comment_owner'}}}}).exec()
        .then(result => {
            console.log("Extracting questions: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "questions fetched successfully",
                "data": result
            }
           console.log(JSON.stringify(resp));
            res.end(JSON.stringify(resp));
        })
        .catch(err => {
            console.log(err)
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 0,
                "msg": "Cannot fetch user",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

module.exports = router;
