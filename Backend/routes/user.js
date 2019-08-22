var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var User = require('../models/user')
var Topic = require('../models/topic')
var Question = require('../models/question')
var Message = require('../models/message')
var Answer = require('../models/answer')
var Activity = require('../models/activity')
var mysql = require('mysql')
var pool = require('../connections/mysql')
var path = require('path')
var kafka = require('../kafka/client')
var cookieParser = require('cookie-parser')
const EXP_TIME = 400
var redis = require('redis')
let client = redis.createClient()
client.on('connect', function () {
    console.log("conntected to Redis")
})
// var redis = redisClient(6379, 'localhost')

router.use(cookieParser())

//Get Details of the user
router.get("/:user_id", function (req, res) {
    console.log("getting the user")
    let user_id = req.params.user_id

    kafka.make_request("getUserDetails", user_id, function (err, result) {
        if (err) {
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
        } else {
            console.log("Extracting User: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User fetched successfully",
                "data": result
            }
            res.end(JSON.stringify(resp));
        }
    })

    // User.findById(user_id).populate({ path: 'topic' }).exec()
    //     .then(result => {
    //         console.log("Extracting User: ")
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 1,
    //             "msg": "User fetched successfully",
    //             "data": result
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "Cannot fetch user",
    //             "data": {}
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
})

//Get Home of the user
router.get("/:user_id/home", function (req, res) {
    console.log("getting the user")
    let user_id = req.params.user_id
    kafka.make_request("getUserHome", user_id, function (err, result) {
        if (err) {
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
        } else {
            console.log("Extracting User: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User fetched successfully",
                "data": result
            }
            res.end(JSON.stringify(resp));
        }
    })
    
    
    // User.findById(user_id).select('topic upvote downvote bookmark').populate(
    //     { path: 'topic', populate: { path: 'question',
    //          populate: { path: 'answer',
    //             populate: [{ path: 'answer_owner', select: 'firstname lastname description' },
    //                 {path:'comment', populate:{path:'comment_owner'}}] } } }).exec()
    //     .then(result => {
    //         console.log("Extracting User: ")
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 1,
    //             "msg": "User's home fetched successfully",
    //             "data": result
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "Cannot fetch user's home",
    //             "data": {}
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
})


// Getting Count
router.get("/:user_id/count", function (req, res) {
    console.log("getting the user")
    let user_id = req.params.user_id

    kafka.make_request("getUserCount", user_id, function (err, result) {
        if (err) {
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
        } else {
            console.log("Extracting User: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User fetched successfully",
                "data": result
            }
            res.end(JSON.stringify(resp));
        }
    })



    // Question.countDocuments({ question_owner: user_id }).exec()
    //     .then(result1 => {
    //         Answer.countDocuments({ answer_owner: user_id }).exec()
    //             .then(result2 => {
    //                 User.countDocuments({ following: user_id }).exec()
    //                     .then(result3 => {
    //                         User.countDocuments({ follower: user_id }).exec()
    //                             .then(result4 => {
    //                                 console.log("Extracting User: ")
    //                                 res.writeHead(200, {
    //                                     'Content-Type': 'application/json'
    //                                 })
    //                                 const resp = {
    //                                     "status": 1,
    //                                     "msg": "User fetched successfully",
    //                                     "data": {
    //                                         "questionCount": result1,
    //                                         "answerCount": result2,
    //                                         "followerCount": result3,
    //                                         "followingCount": result4
    //                                     }
    //                                 }
    //                                 res.end(JSON.stringify(resp));
    //                             })
    //                             .catch(err => {
    //                                 console.log(err)
    //                                 res.writeHead(200, {
    //                                     'Content-Type': 'application/json'
    //                                 })
    //                                 const resp = {
    //                                     "status": 0,
    //                                     "msg": "Cannot fetch follower count",
    //                                     "data": {}
    //                                 }
    //                                 res.end(JSON.stringify(resp));
    //                             })
    //                     })
    //                     .catch(err => {
    //                         console.log(err)
    //                         res.writeHead(200, {
    //                             'Content-Type': 'application/json'
    //                         })
    //                         const resp = {
    //                             "status": 0,
    //                             "msg": "Cannot fetch following count",
    //                             "data": {}
    //                         }
    //                         res.end(JSON.stringify(resp));
    //                     })
    //             })
    //             .catch(err => {
    //                 console.log(err)
    //                 res.writeHead(200, {
    //                     'Content-Type': 'application/json'
    //                 })
    //                 const resp = {
    //                     "status": 0,
    //                     "msg": "Cannot fetch answer count",
    //                     "data": {}
    //                 }
    //                 res.end(JSON.stringify(resp));
    //             })
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "Cannot fetch question count",
    //             "data": {}
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
})

//Updating Name
router.put("/:user_id/name", function (req, res, next) {

    let user_id = req.params.user_id
    let firstname = req.body.firstname
    let lastname = req.body.lastname
    let email = req.body.email

    pool.getConnection(function (err, con) {
        if (err) {
            res.writeHead(200, {
                'content-type': 'application/json'
            })
            let resp = {
                "status": 0,
                "msg": "Server Failure",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        } else {
            query = `update users set firstname="${firstname}",lastname="${lastname}" where email = "${email}"`
            console.log(query)
            con.query(query, function (err, result_sql) {
                if (err) {
                    console.log(err)
                    res.writeHead(200, {
                        'content-type': 'application/json'
                    })
                    let resp = {
                        "status": 0,
                        "msg": "Query failure",
                        "data": result_sql
                    }
                    res.end(JSON.stringify(resp));
                } else {
                    User.findByIdAndUpdate(user_id, { $set: { firstname: firstname, lastname: lastname } }, { new: true }).exec()
                        .then(result => {

                            res.writeHead(200, {
                                'Content-Type': 'application/json'
                            })
                            const resp = {
                                "status": 1,
                                "msg": "Name updated Successfully",
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
                                "msg": "cannot update name",
                                "data": {}
                            }
                            res.end(JSON.stringify(resp));
                        })

                }
            })
        }
    })
})

//Updating description
router.put("/:user_id/description", function (req, res, next) {


    const requestData = {
        user_id : req.params.user_id,
        description : req.body.description
    }
    
        kafka.make_request("updateUserDesc", requestData, function (err, result) {
            if (err) {
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
            } else {
                console.log("Extracting User: ")
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                })
                const resp = {
                    "status": 1,
                    "msg": "User fetched successfully",
                    "data": result
                }
                res.end(JSON.stringify(resp));
            }
        })




    // let user_id = req.params.user_id
    // let description = req.body.description

    // User.findByIdAndUpdate(user_id, { $set: { description: description } }, { new: true }).exec()
    //     .then(result => {
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 1,
    //             "msg": "Description updated Successfully",
    //             "data": result
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "cannot update description",
    //             "data": {}
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
})

//Updating credential
router.put("/:user_id/credential", function (req, res, next) {


    const requestData = {
        user_id : req.params.user_id,
        credential : req.body.credential
    }

    kafka.make_request("updateUserCred", requestData, function (err, result) {
        if (err) {
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
        } else {
            console.log("Extracting User: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User fetched successfully",
                "data": result
            }
            res.end(JSON.stringify(resp));
        }
    })



    // let user_id = req.params.user_id
    // let credential = req.body.credential

    // User.findByIdAndUpdate(user_id, { $set: { credential: credential } }, { new: true }).exec()
    //     .then(result => {
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 1,
    //             "msg": "Credential updated Successfully",
    //             "data": result
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "cannot update credential",
    //             "data": {}
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
})

//Adding education
router.put("/:user_id/education", function (req, res, next) {

    const requestData = {
        user_id : req.params.user_id,
        school : req.body.school,
        concentration : req.body.concentration,
        degree : req.body.degree,
        graduation_year : req.body.graduation_year,
    }
    kafka.make_request("addingUserEd", requestData, function (err, result) {
        if (err) {
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
        } else {
            console.log("Extracting User: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User fetched successfully",
                "data": result
            }
            res.end(JSON.stringify(resp));
        }
    })
    
    
    
    
    // let user_id = req.params.user_id
    // let school = req.body.school
    // let concentration = req.body.concentration
    // let degree = req.body.degree
    // let graduation_year = req.body.graduation_year

    // User.findByIdAndUpdate(user_id,
    //     {
    //         $push: {
    //             education:
    //             {
    //                 school: school,
    //                 concentration: concentration,
    //                 degree: degree,
    //                 graduation_year: graduation_year
    //             }
    //         }
    //     }, { new: true }).exec()
    //     .then(result => {
    //         if (!result.credential) {
    //             let credential = concentration + " at " + school
    //             User.findByIdAndUpdate(user_id, { $set: { credential: credential } }, { new: true }).exec()
    //                 .then(result => {
    //                     res.writeHead(200, {
    //                         'Content-Type': 'application/json'
    //                     })
    //                     const resp = {
    //                         "status": 1,
    //                         "msg": "Credential and Education updated Successfully",
    //                         "data": result
    //                     }
    //                     res.end(JSON.stringify(resp));
    //                 })
    //                 .catch(err => {
    //                     console.log(err)
    //                     res.writeHead(200, {
    //                         'Content-Type': 'application/json'
    //                     })
    //                     const resp = {
    //                         "status": 0,
    //                         "msg": "cannot update credential",
    //                         "data": {}
    //                     }
    //                     res.end(JSON.stringify(resp));
    //                 })
    //         } else {
    //             res.writeHead(200, {
    //                 'Content-Type': 'application/json'
    //             })
    //             const resp = {
    //                 "status": 1,
    //                 "msg": "Education updated Successfully",
    //                 "data": result
    //             }
    //             res.end(JSON.stringify(resp));
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "cannot update education",
    //             "data": {}
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
})

//Updating particular education
router.put("/:user_id/education/:education_id", function (req, res, next) {

    const requestData = {
        user_id : req.params.user_id,
        education_id : req.params.education_id,
        concentration : req.body.concentration,
        school : req.body.school,
        degree : req.body.degree,
        graduation_year : req.body.graduation_year,
    }
    kafka.make_request("updatingUserEd", requestData, function (err, result) {
        if (err) {
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
        } else {
            console.log("Extracting User: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User fetched successfully",
                "data": result
            }
            res.end(JSON.stringify(resp));
        }
    })


    // let education_id = req.params.education_id
    // let user_id = req.params.user_id
    // let school = req.body.school
    // let concentration = req.body.concentration
    // let degree = req.body.degree
    // let graduation_year = req.body.graduation_year

    // User.findOneAndUpdate({ _id: user_id, "education._id": education_id },
    //     {
    //         "education.$.school": school,
    //         "education.$.concentration": concentration,
    //         "education.$.degree": degree,
    //         "education.$.graduation_year": graduation_year
    //     }, { new: true }).exec()
    //     .then(result => {
    //         if (!result.credential) {
    //             let credential = concentration + " at " + school
    //             User.findByIdAndUpdate(user_id, { $set: { credential: credential } }, { new: true }).exec()
    //                 .then(result => {
    //                     res.writeHead(200, {
    //                         'Content-Type': 'application/json'
    //                     })
    //                     const resp = {
    //                         "status": 1,
    //                         "msg": "Credential and Education updated Successfully",
    //                         "data": result
    //                     }
    //                     res.end(JSON.stringify(resp));
    //                 })
    //                 .catch(err => {
    //                     console.log(err)
    //                     res.writeHead(200, {
    //                         'Content-Type': 'application/json'
    //                     })
    //                     const resp = {
    //                         "status": 0,
    //                         "msg": "cannot update credential",
    //                         "data": {}
    //                     }
    //                     res.end(JSON.stringify(resp));
    //                 })
    //         } else {
    //             res.writeHead(200, {
    //                 'Content-Type': 'application/json'
    //             })
    //             const resp = {
    //                 "status": 1,
    //                 "msg": "Education updated Successfully",
    //                 "data": result
    //             }
    //             res.end(JSON.stringify(resp));
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "cannot update education",
    //             "data": {}
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
})

//Deleting particular education
router.delete("/:user_id/education/:education_id", function (req, res, next) {


    const requestData = {
        user_id : req.params.user_id,
        education_id : req.params.education_id,
        concentration : req.body.concentration,
        school : req.body.school,
        degree : req.body.degree,
        graduation_year : req.body.graduation_year,
    }
    kafka.make_request("deletingUserEd", requestData, function (err, result) {
        if (err) {
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
        } else {
            console.log("Extracting User: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User fetched successfully",
                "data": result
            }
            res.end(JSON.stringify(resp));
        }
    })




    // let education_id = req.params.education_id
    // let user_id = req.params.user_id
    // let school = req.body.school
    // let concentration = req.body.concentration
    // let degree = req.body.degree
    // let graduation_year = req.body.graduation_year

    // User.findByIdAndUpdate(user_id,
    //     { $pull: { "education": { _id: education_id } } }, { new: true }).exec()
    //     .then(result => {
    //         let credential = concentration + " at " + school
    //         if (result.credential == credential) {
    //             User.findByIdAndUpdate(user_id, { $unset: { credential: credential } }, { new: true }).exec()
    //                 .then(result => {
    //                     res.writeHead(200, {
    //                         'Content-Type': 'application/json'
    //                     })
    //                     const resp = {
    //                         "status": 1,
    //                         "msg": "Credential and Education Deleted Successfully",
    //                         "data": result
    //                     }
    //                     res.end(JSON.stringify(resp));
    //                 })
    //                 .catch(err => {
    //                     console.log(err)
    //                     res.writeHead(200, {
    //                         'Content-Type': 'application/json'
    //                     })
    //                     const resp = {
    //                         "status": 0,
    //                         "msg": "cannot delete credential",
    //                         "data": {}
    //                     }
    //                     res.end(JSON.stringify(resp));
    //                 })
    //         } else {
    //             res.writeHead(200, {
    //                 'Content-Type': 'application/json'
    //             })
    //             const resp = {
    //                 "status": 1,
    //                 "msg": "Education deleted Successfully",
    //                 "data": result
    //             }
    //             res.end(JSON.stringify(resp));
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "cannot update education",
    //             "data": {}
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
})


//Adding career
router.put("/:user_id/career", function (req, res, next) {


    const requestData = {
        user_id : req.params.user_id,
        position : req.body.position,
        company : req.body.company,
        start_year : req.body.start_year,
        end_year : req.body.end_year,
        current : req.body.current,
    }
    kafka.make_request("addingUserCarrer", requestData, function (err, result) {
        if (err) {
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
        } else {
            console.log("Extracting User: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User fetched successfully",
                "data": result
            }
            res.end(JSON.stringify(resp));
        }
    })



    // let user_id = req.params.user_id
    // let position = req.body.position
    // let company = req.body.company
    // let start_year = req.body.start_year
    // let end_year = req.body.end_year
    // let current = req.body.current

    // User.findByIdAndUpdate(user_id,
    //     {
    //         $push: {
    //             career:
    //             {
    //                 position: position,
    //                 company: company,
    //                 start_year: start_year,
    //                 end_year: end_year,
    //                 current: current
    //             }
    //         }
    //     }, { new: true }).exec()
    //     .then(result => {
    //         if (!result.credential || current) {
    //             let credential = position + " at " + company
    //             User.findByIdAndUpdate(user_id, { $set: { credential: credential } }, { new: true }).exec()
    //                 .then(result => {
    //                     res.writeHead(200, {
    //                         'Content-Type': 'application/json'
    //                     })
    //                     const resp = {
    //                         "status": 1,
    //                         "msg": "Credential and Career updated Successfully",
    //                         "data": result
    //                     }
    //                     res.end(JSON.stringify(resp));
    //                 })
    //                 .catch(err => {
    //                     console.log(err)
    //                     res.writeHead(200, {
    //                         'Content-Type': 'application/json'
    //                     })
    //                     const resp = {
    //                         "status": 0,
    //                         "msg": "cannot update credential",
    //                         "data": {}
    //                     }
    //                     res.end(JSON.stringify(resp));
    //                 })
    //         } else {
    //             res.writeHead(200, {
    //                 'Content-Type': 'application/json'
    //             })
    //             const resp = {
    //                 "status": 1,
    //                 "msg": "Career updated Successfully",
    //                 "data": result
    //             }
    //             res.end(JSON.stringify(resp));
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "cannot update career",
    //             "data": {}
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
})

//Updating particular career
router.put("/:user_id/career/:career_id", function (req, res, next) {

    
    const requestData = {
        user_id : req.params.user_id,
        career_id : req.params.career_id,
        position : req.body.position,
        company : req.body.company,
        start_year : req.body.start_year,
        end_year : req.body.end_year,
        current : req.body.current,
    }
    kafka.make_request("updatingUserCareer", requestData, function (err, result) {
        if (err) {
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
        } else {
            console.log("Extracting User: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User fetched successfully",
                "data": result
            }
            res.end(JSON.stringify(resp));
        }
    })
    
    
    
    
    // let career_id = req.params.career_id
    // let user_id = req.params.user_id
    // let position = req.body.position
    // let company = req.body.company
    // let start_year = req.body.start_year
    // let end_year = req.body.end_year
    // let current = req.body.current

    // User.findOneAndUpdate({ _id: user_id, "career.current": true }, { "career.$.current": !current }).exec()
    //     .then(result1 => {
    //         User.findOneAndUpdate({ _id: user_id, "career._id": career_id },
    //             {
    //                 "career.$.position": position,
    //                 "career.$.company": company,
    //                 "career.$.start_year": start_year,
    //                 "career.$.end_year": end_year,
    //                 "career.$.current": current
    //             }, { new: true }).exec()
    //             .then(result => {
    //                 let credential = position + " at " + company
    //                 if (!result.credential || current) {
    //                     User.findByIdAndUpdate(user_id, { $set: { credential: credential } }, { new: true }).exec()
    //                         .then(result => {
    //                             res.writeHead(200, {
    //                                 'Content-Type': 'application/json'
    //                             })
    //                             const resp = {
    //                                 "status": 1,
    //                                 "msg": "Credential and Career updated Successfully",
    //                                 "data": result
    //                             }
    //                             res.end(JSON.stringify(resp));
    //                         })
    //                         .catch(err => {
    //                             console.log(err)
    //                             res.writeHead(200, {
    //                                 'Content-Type': 'application/json'
    //                             })
    //                             const resp = {
    //                                 "status": 0,
    //                                 "msg": "cannot update credential",
    //                                 "data": {}
    //                             }
    //                             res.end(JSON.stringify(resp));
    //                         })
    //                 } else {
    //                     res.writeHead(200, {
    //                         'Content-Type': 'application/json'
    //                     })
    //                     const resp = {
    //                         "status": 1,
    //                         "msg": "Career updated Successfully",
    //                         "data": result
    //                     }
    //                     res.end(JSON.stringify(resp));
    //                 }
    //             })
    //             .catch(err => {
    //                 console.log(err)
    //                 res.writeHead(200, {
    //                     'Content-Type': 'application/json'
    //                 })
    //                 const resp = {
    //                     "status": 0,
    //                     "msg": "cannot update career",
    //                     "data": {}
    //                 }
    //                 res.end(JSON.stringify(resp));
    //             })
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "cannot update career",
    //             "data": {}
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
})

//Deleting particular career
router.delete("/:user_id/career/:career_id", function (req, res, next) {

    const requestData = {
        user_id : req.params.user_id,
        career_id : req.params.career_id,
        position : req.body.position,
        company : req.body.company,
        start_year : req.body.start_year,
        end_year : req.body.end_year,
        current : req.body.current,
    }
    kafka.make_request("deletingUserCareer", requestData, function (err, result) {
        if (err) {
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
        } else {
            console.log("Extracting User: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User fetched successfully",
                "data": result
            }
            res.end(JSON.stringify(resp));
        }
    })


    // let career_id = req.params.career_id
    // let user_id = req.params.user_id
    // let position = req.body.position
    // let company = req.body.company
    // let start_year = req.body.start_year
    // let end_year = req.body.end_year
    // let current = req.body.current

    // User.findByIdAndUpdate(user_id,
    //     { $pull: { "career": { _id: career_id } } }, { new: true }).exec()
    //     .then(result => {
    //         let credential = position + " at " + company
    //         if (result.credential == credential) {
    //             User.findByIdAndUpdate(user_id, { $unset: { credential: credential } }, { new: true }).exec()
    //                 .then(result => {
    //                     res.writeHead(200, {
    //                         'Content-Type': 'application/json'
    //                     })
    //                     const resp = {
    //                         "status": 1,
    //                         "msg": "Credential and career Deleted Successfully",
    //                         "data": result
    //                     }
    //                     res.end(JSON.stringify(resp));
    //                 })
    //                 .catch(err => {
    //                     console.log(err)
    //                     res.writeHead(200, {
    //                         'Content-Type': 'application/json'
    //                     })
    //                     const resp = {
    //                         "status": 0,
    //                         "msg": "cannot delete credential",
    //                         "data": {}
    //                     }
    //                     res.end(JSON.stringify(resp));
    //                 })
    //         } else {
    //             res.writeHead(200, {
    //                 'Content-Type': 'application/json'
    //             })
    //             const resp = {
    //                 "status": 1,
    //                 "msg": "Career deleted Successfully",
    //                 "data": result
    //             }
    //             res.end(JSON.stringify(resp));
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "cannot update career",
    //             "data": {}
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
})

//set a career as current
router.put("/:user_id/career/:career_id/current", function (req, res, next) {

    const requestData = {
        user_id : req.params.user_id,
        career_id : req.params.career_id,
        position : req.body.position,
        company : req.body.company,
        start_year : req.body.start_year,
        end_year : req.body.end_year,
    }
    kafka.make_request("settingUserCareer", requestData, function (err, result) {
        if (err) {
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
        } else {
            console.log("Extracting User: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User fetched successfully",
                "data": result
            }
            res.end(JSON.stringify(resp));
        }
    })



    // let user_id = req.params.user_id
    // let career_id = req.params.career_id
    // let position = req.body.position
    // let company = req.body.company
    // let start_year = req.body.start_year
    // let end_year = req.body.end_year

    // User.findOneAndUpdate({ _id: user_id, "career.current": true }, { "career.$.current": false }).exec()
    //     .then(result1 => {
    //         User.findOneAndUpdate({ _id: user_id, "career._id": career_id }, { "career.$.current": true }).exec()
    //             .then(result2 => {
    //                 let credential = position + " at " + company
    //                 User.findByIdAndUpdate(user_id, { $set: { credential: credential } }, { new: true }).exec()
    //                     .then(result3 => {
    //                         res.writeHead(200, {
    //                             'Content-Type': 'application/json'
    //                         })
    //                         const resp = {
    //                             "status": 1,
    //                             "msg": "Credential and Career updated Successfully",
    //                             "data": result3
    //                         }
    //                         res.end(JSON.stringify(resp));
    //                     })
    //                     .catch(err => {
    //                         console.log(err)
    //                         res.writeHead(200, {
    //                             'Content-Type': 'application/json'
    //                         })
    //                         const resp = {
    //                             "status": 0,
    //                             "msg": "cannot update credential",
    //                             "data": {}
    //                         }
    //                         res.end(JSON.stringify(resp));
    //                     })

    //             })
    //             .catch(err => {
    //                 console.log(err)
    //                 res.writeHead(200, {
    //                     'Content-Type': 'application/json'
    //                 })
    //                 const resp = {
    //                     "status": 0,
    //                     "msg": "cannot update career",
    //                     "data": {}
    //                 }
    //                 res.end(JSON.stringify(resp));
    //             })
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "cannot update career",
    //             "data": {}
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
})

//Updating location
router.put("/:user_id/location", function (req, res, next) {

    const requestData = {
        user_id : req.params.user_id,
        city : req.body.city,
        state : req.body.state,
        zipcode : req.body.zipcode,
    }

    kafka.make_request("updateUserLocation", requestData, function (err, result) {
        if (err) {
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
        } else {
            console.log("Extracting User: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User fetched successfully",
                "data": result
            }
            res.end(JSON.stringify(resp));
        }
    })
    
    
    
    // let user_id = req.params.user_id
    // let city = req.body.city
    // let state = req.body.state
    // let zipcode = req.body.zipcode

    // User.findByIdAndUpdate(user_id, { $set: { city: city, state: state, zipcode: zipcode } }, { new: true }).exec()
    //     .then(result => {
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 1,
    //             "msg": "Location updated Successfully",
    //             "data": result
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "cannot update location",
    //             "data": {}
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
})

//uploading photo
router.put("/:user_id/image", function (req, res, next) {
    console.log("Uploading Profile Photo")
    let user_id = req.params.user_id
    let imageFile = req.files.image
    console.log(imageFile.name);
    imageFile.mv(`./public/uploads/profilephoto/userprofile-${user_id}${path.extname(imageFile.name)}`, function (err) {
        console.log("Hii")
        if (err) {
            console.log(err)
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 0,
                "msg": "Cannot upload photo",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        } else {
            User.findByIdAndUpdate(user_id, {
                $set: {
                    image: `/public/uploads/profilephoto/userprofile-${user_id}${path.extname(imageFile.name)}`
                },
            }, { new: true }).exec()
                .then(result => {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    const resp = {
                        "status": 1,
                        "msg": `public/uploads/profilephoto/userprofile-${user_id}${path.extname(imageFile.name)}`,
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
                        "msg": "Cannot update database",
                        "data": {}
                    }
                    res.end(JSON.stringify(resp));
                })
        }
    })
})

//Updating follow user
router.put("/:user_id/follow_user", function (req, res, next) {


    const requestData = {
        user_id : req.params.user_id,
        user2 : req.files.user2
       }

       kafka.make_request("updateFollowUser", requestData, function (err, result) {
        if (err) {
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
        } else {
            console.log("Extracting User: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User fetched successfully",
                "data": result
            }
            res.end(JSON.stringify(resp));
        }
    })


    // let user_id = req.params.user_id
    // let user2 = req.body.user2

    // User.findByIdAndUpdate(user_id, { $push: { following: user2 } }, { new: true }).exec()
    //     .then(result1 => {
    //         User.findByIdAndUpdate(user2, { $push: { follower: user_id } }).exec()
    //             .then(result2 => {
    //                 var activity = new Activity({
    //                     user: user_id,
    //                     activity_name: "Followed a user",
    //                     activity: user2,
    //                     onModel: "users"
    //                 })
    //                 activity.save()
    //                     .then(resultTest => {

    //                         res.writeHead(200, {
    //                             'Content-Type': 'application/json'
    //                         })
    //                         const resp = {
    //                             "status": 1,
    //                             "msg": "User followed Successfully",
    //                             "data": result1
    //                         }
    //                         res.end(JSON.stringify(resp));
    //                     })
    //                     .catch(err => {
    //                         console.log(err)
    //                         res.writeHead(200, {
    //                             'Content-Type': 'application/json'
    //                         })
    //                         const resp = {
    //                             "status": 0,
    //                             "msg": "cannot update user",
    //                             "data": {}
    //                         }
    //                         res.end(JSON.stringify(resp));
    //                     })

    //             })
    //             .catch(err => {
    //                 console.log(err)
    //                 res.writeHead(200, {
    //                     'Content-Type': 'application/json'
    //                 })
    //                 const resp = {
    //                     "status": 0,
    //                     "msg": "cannot update user",
    //                     "data": {}
    //                 }
    //                 res.end(JSON.stringify(resp));
    //             })
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "cannot follow",
    //             "data": {}
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
})

//Updating unfollow user
router.put("/:user_id/unfollow_user", function (req, res, next) {






    let user_id = req.params.user_id
    let user2 = req.body.user2

    User.findByIdAndUpdate(user_id, { $pull: { following: user2 } }, { new: true }).exec()
        .then(result1 => {
            User.findByIdAndUpdate(user2, { $pull: { follower: user_id } }).exec()
                .then(result2 => {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    const resp = {
                        "status": 1,
                        "msg": "User unfollowed Successfully",
                        "data": result1
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
                "msg": "cannot unfollow",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

//Get Questions of the user
router.get("/:user_id/questions", function (req, res) {
    console.log("getting the user's questions")
    let user_id = req.params.user_id

    // kafka.make_request("getQuestions", user_id, function (err, result) {
    //     if (err) {
    //         console.log(err)
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "Cannot fetch user's questions",
    //             "data": {}
    //         }
    //         res.end(JSON.stringify(resp));
    //     } else {
    //         console.log("Extracting Questions: ")
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 1,
    //             "msg": "User's questions fetched successfully",
    //             "data": result
    //         }
    //         res.end(JSON.stringify(resp));
    //     }
    // })

    // --------------Redis + Backend------------------
    // client.get("getQuestions" + user_id, function (err, reply) {
    //     if (err) {
    //         console.log(err)
    //         console.log(err)
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "Cannot fetch user's questions from redis",
    //             "data": {}
    //         }
    //         res.end(JSON.stringify(resp));
    //     } else {
    //         if (reply) {
    //             console.log("Extracting Questions from Redis: ")
    //             res.writeHead(200, {
    //                 'Content-Type': 'application/json'
    //             })
    //             const resp = {
    //                 "status": 1,
    //                 "msg": "User's questions fetched successfully",
    //                 "data": reply
    //             }
    //             res.end(JSON.stringify(resp));
    //         } else {
    //             User.findById(user_id).select('question').populate({ path: 'question', options: { limit: 5 }, populate: { path: 'answer', options: { limit: 5 } } }).exec()
    //                 .then(result => {
    //                     console.log("Extracting Questions: ")

    //                     res.writeHead(200, {
    //                         'Content-Type': 'application/json'
    //                     })
    //                     const resp = {
    //                         "status": 1,
    //                         "msg": "User's questions fetched successfully",
    //                         "data": result
    //                     }
    //                     client.setex("getQuestions" + user_id, EXP_TIME, JSON.stringify(result))
    //                     res.end(JSON.stringify(resp));
    //                 })
    //                 .catch(err => {
    //                     console.log(err)
    //                     res.writeHead(200, {
    //                         'Content-Type': 'application/json'
    //                     })
    //                     const resp = {
    //                         "status": 0,
    //                         "msg": "Cannot fetch user's questions",
    //                         "data": {}
    //                     }
    //                     res.end(JSON.stringify(resp));
    //                 })
    //         }
    //     }
    // })


    // --------------Backend------------------

    User.findById(user_id).select('question').populate({ path: 'question', options: { limit: 5 }, populate: { path: 'answer', options: { limit: 5 } } }).exec()
        .then(result => {
            console.log("Extracting Questions: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User's questions fetched successfully",
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
                "msg": "Cannot fetch user's questions",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

//Get Answers of the user
router.get("/:user_id/answers", function (req, res) {
    console.log("getting the user's answers")
    let user_id = req.params.user_id

    kafka.make_request("getAnswers", user_id, function (err, result) {
        if (err) {
            console.log(err)
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 0,
                "msg": "Cannot fetch user's answers",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        } else {
            console.log("Extracting Answers: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User's answers fetched successfully",
                "data": result
            }
            res.end(JSON.stringify(resp));
        }
    })



    // User.findById(user_id).select('followed_question answer').populate({ path: 'answer', options: { limit: 5 }, populate: { path: 'question', options: { limit: 5 }, select: 'question' } }).exec()
    //     .then(result => {
    //         console.log("Extracting Answers: ")
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 1,
    //             "msg": "User's answers fetched successfully",
    //             "data": result
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "Cannot fetch user's answers",
    //             "data": {}
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
})

//Get Followers of the user
router.get("/:user_id/followers", function (req, res) {
    console.log("getting the user's followers")
    let user_id = req.params.user_id
    
    kafka.make_request("getFollowers", user_id, function (err, result) {
        if (err) {
            console.log(err)
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 0,
                "msg": "Cannot fetch user's answers",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        } else {
            console.log("Extracting Answers: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User's answers fetched successfully",
                "data": result
            }
            res.end(JSON.stringify(resp));
        }
    })
    
    
    
    // User.findById(user_id).select('follower').populate('follower', '_id firstname lastname image credential').exec()
    //     .then(result => {
    //         console.log("Extracting Followers: ")
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 1,
    //             "msg": "User's followers fetched successfully",
    //             "data": result
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "Cannot fetch user's followers",
    //             "data": {}
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
})

//Get Followings of the user
router.get("/:user_id/following", function (req, res) {
    console.log("getting the user's following")
    let user_id = req.params.user_id

    kafka.make_request("getFollowings", user_id, function (err, result) {
        if (err) {
            console.log(err)
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 0,
                "msg": "Cannot fetch user's answers",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        } else {
            console.log("Extracting Answers: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User's answers fetched successfully",
                "data": result
            }
            res.end(JSON.stringify(resp));
        }
    })



    // User.findById(user_id).select('following').populate('following', '_id firstname lastname image credential').exec()
    //     .then(result => {
    //         console.log("Extracting Following: ")
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 1,
    //             "msg": "User's following fetched successfully",
    //             "data": result
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "Cannot fetch user's following",
    //             "data": {}
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
})

//Get bookmarked Answers of the user
router.get("/:user_id/bookmarked_answers", function (req, res) {
    console.log("getting the user's bookmarked answers")
    let user_id = req.params.user_id

    User.findById(user_id).select('bookmark').populate({ path: 'bookmark', populate: [{ path: 'question' },{ path: 'answer_owner', select: 'firstname lastname image' }] }).exec()
        .then(result => {
            console.log("Extracting bookmarked Answers: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User's bookmarked answers fetched successfully",
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
                "msg": "Cannot fetch user's bookmarked answers",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})


//Adding Topics user knows
router.put("/:user_id/topic", function (req, res, next) {

    const requestData = {
        user_id : req.params.user_id,
        topic : req.files.topic
       }
       kafka.make_request("addingUserTopic", user_id, function (err, result) {
        if (err) {
            console.log(err)
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 0,
                "msg": "Cannot fetch user's answers",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        } else {
            console.log("Extracting Answers: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User's answers fetched successfully",
                "data": result
            }
            res.end(JSON.stringify(resp));
        }
    })


    // let user_id = req.params.user_id
    // let topic = req.body.topic

    // User.findByIdAndUpdate(user_id, { $push: { topic: topic } }, { new: true }).exec()
    //     .then(result => {
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 1,
    //             "msg": "Topics added Successfully",
    //             "data": result
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.writeHead(200, {
    //             'Content-Type': 'application/json'
    //         })
    //         const resp = {
    //             "status": 0,
    //             "msg": "cannot update description",
    //             "data": {}
    //         }
    //         res.end(JSON.stringify(resp));
    //     })
})

//Following a Topic
router.put("/:user_id/topic/:topic_id/follow", function (req, res, next) {

    let user_id = req.params.user_id
    let topic = req.params.topic_id

    User.findByIdAndUpdate(user_id, { $push: { topic: topic } }, { new: true }).exec()
        .then(result => {

            var activity = new Activity({
                user: user_id,
                activity_name: "Followed a topic",
                activity: topic,
                onModel: "topics"
            })
            activity.save()
                .then(resultTest => {

                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    const resp = {
                        "status": 1,
                        "msg": "Topic added Successfully",
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
                        "msg": "cannot update description",
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
                "msg": "cannot update description",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

//Unfollowing a topic
router.put("/:user_id/topic/:topic_id/unfollow", function (req, res, next) {

    let user_id = req.params.user_id
    let topic = req.params.topic_id

    User.findByIdAndUpdate(user_id, { $pull: { topic: topic } }, { new: true }).exec()
        .then(result => {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "Topic unfollowed Successfully",
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
                "msg": "cannot update description",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

//Get Conversations of the user
router.get("/:user_id/conversations", function (req, res) {
    console.log("getting the user's conversations")
    let user_id = req.params.user_id
    Message.find({ members: user_id }).select('members').populate('members', '_id firstname lastname image').exec()
        .then(result => {
            console.log("Extracting Conversations: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User's conversations fetched successfully",
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
                "msg": "Cannot fetch user's conversations",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

router.put('/:user_id/deactivate', function (req, res, next) {

    console.log("Deactivate Request");
    let email = req.body.email;
    console.log(email)

    pool.getConnection(function (err, con) {
        if (err) {
            res.writeHead(200, {
                'content-type': 'application/json'
            })
            let resp = {
                "status": 0,
                "msg": "Connection failure Mysql",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        } else {
            query = `update users set isDeactivated=1 where email="${email}"`
            console.log(query)
            con.query(query, function (err, result) {
                if (err) {
                    console.log(err)
                    res.writeHead(200, {
                        'content-type': 'application/json'
                    })
                    let resp = {
                        "status": 0,
                        "msg": "Server error mysql",
                        "data": {}
                    }
                    res.end(JSON.stringify(resp));
                } else {
                    User.findOneAndUpdate({ "email": email }, { $set: { isDeactivated: true } }, { new: true }).exec()
                        .then(result => {
                            console.log("Deactivating account")
                            res.writeHead(200, {
                                'Content-Type': 'application/json'
                            })
                            const resp = {
                                "status": 1,
                                "msg": "Deactivated Successfully",
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
                                "msg": "No such user",
                                "data": {}
                            }
                            res.end(JSON.stringify(resp));
                        })
                }
            })
        }
    })
})

router.post("/:user_id/change_password", function (req, res, next) {
    console.log("Change Password Request")

    let email = req.body.email
    let current_password = req.body.current_password
    let new_password = bcrypt.hashSync(req.body.new_password, 10)
    console.log(req.body.current_password)
    console.log(req.body.new_password)

    pool.getConnection(function (err, con) {
        if (err) {
            res.writeHead(200, {
                'content-type': 'application/json'
            })
            let resp = {
                "status": 0,
                "msg": "Connection failure MySql",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        } else {
            query = `select * from users where email="${email}"`
            console.log(query)
            con.query(query, function (err, result) {
                if (err) {
                    console.log(err)
                    res.writeHead(200, {
                        'content-type': 'application/json'
                    })
                    let resp = {
                        "status": 0,
                        "msg": "Server error mysql",
                        "data": {}
                    }
                    res.end(JSON.stringify(resp));
                } else {
                    console.log(result)
                    console.log(current_password)
                    console.log(result[0].password)
                    console.log(bcrypt.compareSync(current_password, result[0].password))
                    if (!bcrypt.compareSync(current_password, result[0].password)) {
                        res.writeHead(200, {
                            'content-type': 'application/json'
                        })
                        let resp = {
                            "status": 0,
                            "msg": "Invalid Password",
                            "data": {}
                        }
                        res.end(JSON.stringify(resp));
                    } else {
                        query = `update users set password="${new_password}" where email="${email}"`
                        console.log(query)
                        con.query(query, function (err, result) {
                            if (err) {
                                console.log(err)
                                res.writeHead(200, {
                                    'content-type': 'application/json'
                                })
                                let resp = {
                                    "status": 0,
                                    "msg": "Server error mysql",
                                    "data": {}
                                }
                                res.end(JSON.stringify(resp));
                            } else {
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                })
                                const resp = {
                                    "status": 1,
                                    "msg": "Password Changed Successfully",
                                    "data": result
                                }
                                res.end(JSON.stringify(resp));
                            }
                        })
                    }
                }
            })
        }
    })
})

//Delete user
router.delete('/:user_id', function (req, res, next) {

    console.log("Delete Request");
    let email = req.body.email;
    console.log(email)

    pool.getConnection(function (err, con) {
        if (err) {
            res.writeHead(200, {
                'content-type': 'application/json'
            })
            let resp = {
                "status": 0,
                "msg": "Connection failure Mysql",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        } else {
            query = `delete users where email="${email}"`
            console.log(query)
            con.query(query, function (err, result) {
                if (err) {
                    console.log(err)
                    res.writeHead(200, {
                        'content-type': 'application/json'
                    })
                    let resp = {
                        "status": 0,
                        "msg": "Server error mysql",
                        "data": {}
                    }
                    res.end(JSON.stringify(resp));
                } else {

                    console.log("Deleting account")
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    })
                    const resp = {
                        "status": 1,
                        "msg": "Deleted Successfully",
                        "data": result
                    }
                    res.end(JSON.stringify(resp));
                }
            })
        }
    })
})

//Get Activities of the user
router.get("/:user_id/activity", function (req, res) {
    console.log("getting activities")
    let user_id = req.params.user_id
    Activity.find({ user: user_id }).populate([{ path: 'user', select: 'firstname lastname' }, { path: 'activity' }]).exec()
        .then(async result => {
            var final_result = []
            for (let index = 0; index < result.length; index++) {
                console.log()
                if (result[index].onModel == "answers") {
                    await Activity.findById(result[index]._id).populate({ path: 'activity', populate: { path: 'question' } }).exec()
                        .then(answer_result => {
                            final_result.push(answer_result)
                            console.log(final_result)
                        }).catch(err => {
                            console.log(err)
                        })
                } else if (result[index].onModel == "questions") {
                    await Activity.findById(result[index]._id).populate({ path: 'activity', populate: { path: 'answer' } }).exec()
                        .then(question_result => {
                            final_result.push(question_result)
                            console.log(final_result)
                        }).catch(err => {
                            console.log(err)
                        })
                } else if (result[index].onModel == "topics") {
                    await Activity.findById(result[index]._id).populate({ path: 'activity' }).exec()
                        .then(topic_result => {
                            final_result.push(topic_result)
                            console.log(final_result)
                        }).catch(err => {
                            console.log(err)
                        })
                } else if (result[index].onModel == "users") {
                    await Activity.findById(result[index]._id).populate({ path: 'activity', select: 'firstname lastname image' }).exec()
                        .then(user_result => {
                            final_result.push(user_result)
                            console.log(final_result)
                        }).catch(err => {
                            console.log(err)
                        })
                } else if (result[index].onModel == "comments") {
                    await Activity.findById(result[index]._id).populate({ path: 'activity', populate: { path: 'answer', select: 'answer question', populate: { path: 'question', select: 'question' } } }).exec()
                        .then(question_result => {
                            final_result.push(question_result)
                            console.log(final_result)
                        }).catch(err => {
                            console.log(err)
                        })
                }
            }
            console.log("Extracting User: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "Activity fetched successfully",
                "data": final_result
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
                "msg": "Cannot fetch activity",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

//Updating views of the user
router.put("/:user_id/view", function (req, res) {
    console.log("viewssss")
    let user_id = req.params.user_id
    User.findByIdAndUpdate(user_id, {$push: {view: {count:1}} }, {new:true}).select('view').exec()
        .then(result => {
            console.log("Extracting User: ")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "User's view added successfully",
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
                "msg": "Cannot fetch user's view",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

//Get Answer Stats of the user
router.get("/:user_id/answer_stats", function (req, res) {
    console.log("viewssss")
    let user_id = req.params.user_id
    Answer.find({answer_owner: user_id}).select('view answer answer_owner').sort({view:-1}).limit(3).exec()
        .then(result => {
            console.log("Views:::::::")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "Top Answers got successfully",
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
                "msg": "Cannot fetch user's view",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

//Get Upvotes Stats of the user
router.get("/:user_id/upvote_stats", function (req, res) {
    console.log("viewssss")
    let user_id = req.params.user_id
    Answer.find({answer_owner: user_id}).select('upvote answer answer_owner').sort({upvote:-1}).limit(3).exec()
        .then(result => {
            console.log("Views:::::::")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "Top Answers with upvotes got successfully",
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
                "msg": "Cannot fetch user's view",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

//Get Downvote Stats of the user
router.get("/:user_id/downvote_stats", function (req, res) {
    console.log("viewssss")
    let user_id = req.params.user_id
    Answer.find({answer_owner: user_id}).select('downvote answer answer_owner').sort({downvote:-1}).limit(3).exec()
        .then(result => {
            console.log("Views:::::::")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "Top Answers with downvotes got successfully",
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
                "msg": "Cannot fetch user's view",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

//Get Bookmark Stats of the user
router.get("/:user_id/bookmark_stats", function (req, res) {
    console.log("viewssss")
    let user_id = req.params.user_id
    Answer.find({answer_owner: user_id}).select('bookmark answer answer_owner').sort({bookmark:-1}).limit(3).exec()
        .then(result => {
            console.log("Views:::::::")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "Top Answers with bookmarks got successfully",
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
                "msg": "Cannot fetch user's view",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

//Get Profile Stats of the user
router.get("/:user_id/profile_stats", function (req, res) {
    console.log("viewssss")
    let user_id = req.params.user_id
    User.findById(user_id).select('view').exec()
        .then(result => {
            console.log("Views:::::::")
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            const resp = {
                "status": 1,
                "msg": "Top Answers with bookmarks got successfully",
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
                "msg": "Cannot fetch user's view",
                "data": {}
            }
            res.end(JSON.stringify(resp));
        })
})

module.exports = router;
