var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var User = require('../models/user')
var Question = require('../models/question')
var Answer = require('../models/answer')
var Topic = require('../models/topic')
var mysql = require('mysql')
var pool = require('../connections/mysql')
var cookieParser = require('cookie-parser');

router.use(cookieParser())

router.post("/signup", function (req, res, next) {
	console.log("Sign up Request")
	let firstname = req.body.firstname
	let lastname = req.body.lastname
	let email = req.body.email
	let password = bcrypt.hashSync(req.body.password, 10)
	let topic = req.body.topics

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
			let query = `select email from users where email="${email}"`
			console.log(query)
			con.query(query, function (err, result_sql) {
				if (err) {
					console.log(err)
					res.writeHead(200, {
						'content-type': 'application/json'
					})
					let resp = {
						"status": 0,
						"msg": "Server failure MySql",
						"data": {}
					}
					res.end(JSON.stringify(resp));
				} else if (result_sql.length != 0) {
					res.writeHead(200, {
						'content-type': 'application/json'
					})
					let resp = {
						"status": 0,
						"msg": "Email id already registered MySql",
						"data": {}
					}
					res.end(JSON.stringify(resp));
				} else {
					let query = `insert into users(firstname,lastname,email,password) values("${firstname}","${lastname}","${email}","${password}")`
					console.log(query)
					con.query(query, function (err, result_sql1) {
						if (err) {
							console.log(err)
							res.writeHead(200, {
								'content-type': 'application/json'
							})
							let resp = {
								"status": 0,
								"msg": "Server failure (Inserting) Mysql",
								"data": {}
							}
							res.end(JSON.stringify(resp));
						} else {
							var user = new User({
								firstname: firstname,
								lastname: lastname,
								email: email,
								topic: topic,
								image: "/public/uploads/profilephoto/blank.jpeg"
							})
							console.log("trying to save");
							user.save().then(result_mongo => {
								console.log(result_mongo);
								res.writeHead(200, {
									'content-type': 'application/json'
								})
								let resp = {
									"status": 1,
									"msg": "Successfully added",
									"data": result_mongo
								}
								console.log("creating user")
								res.end(JSON.stringify(resp));
							}, err => {
								console.log(err)
								res.writeHead(200, {
									'content-type': 'application/json'
								})
								let resp = {
									"status": 0,
									"msg": "Email id already registered mongo",
									"data": {}
								}
								console.log("error in creating user")
								res.end(JSON.stringify(resp));
							})
						}
					})
				}
			})
		}
	})
})

router.post('/login', function (req, res, next) {

	console.log("Login Request");
	let email = req.body.email;
	let password = req.body.password;
	console.log(email, password)

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
					if (result.length == 0) {
						res.writeHead(200, {
							'content-type': 'application/json'
						})
						let resp = {
							"status": 0,
							"msg": "Invalid Username",
							"data": {}
						}
						res.end(JSON.stringify(resp));
					} else if (!bcrypt.compareSync(password, result[0].password)) {
						res.writeHead(200, {
							'content-type': 'application/json'
						})
						let resp = {
							"status": 0,
							"msg": "Invalid Username or Password",
							"data": {}
						}
						res.end(JSON.stringify(resp));
					} else {
						query = `update users set isDeactivated=0 where email="${email}"`
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
								User.findOneAndUpdate({ "email": email }, { $set: { isDeactivated: false } }, { new: true }).exec()
									.then(result => {
										if (!result) {
											res.writeHead(200, {
												'Content-Type': 'application/json'
											})
											const resp = {
												"status": 0,
												"msg": "No Such User in Mongo",
												"data": {}
											}
											res.end(JSON.stringify(resp));
										} else {
											console.log("Getting User Data on login")
											// var token = jwt.sign(result.toJSON(), 'secretToken', {
											//   expiresIn: 60 * 60 * 24
											// });
											req.session.user = result;
											res.writeHead(200, {
												'Content-Type': 'application/json'
											})
											const resp = {
												"status": 1,
												"msg": "Logged in Successfully",
												"data": result
												//Token will be added here after we do jwt
												// "token": token


												// {
												// 	"_id": result._id.toString(),
												// 	"email": result.email,
												// 	"firstname": result.firstname,
												// 	"lastname": result.lastname,
												// 	"city": result.city,
												// 	"state": result.state,
												// 	"zipcode": result.zipcode,
												// 	"image": result.image,
												// 	"education": result.education,
												// 	"career": result.career,
												// 	"description": result.description,
												// 	"credential": result.credential,
												// 	"topic": result.topic,
												// 	"question": result.question,
												// 	"answer": result.answer,
												// 	"upvote": result.upvote,
												// 	"downvote": result.downvote,
												// 	"bookmark": result.bookmark,
												// 	"follower": result.follower,
												// 	"following": result.following,
												// 	"followed_question": result.followed_question
												// 	//Token will be added after we do jwt
												// 	//"token": token
												// }
											}
											res.end(JSON.stringify(resp));
										}
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
				}
			})
		}
	})
})

//Search
router.get("/search", function (req, res, next) {
	let q = req.query.q
	console.log(q)
	Question.find({ question: { $regex: q} }).limit(10).exec()
		.then(question_result => {
			Answer.find({ answer: { $regex: q} }).limit(10).populate('question').exec()
				.then(answer_result => {
					Topic.find({ name: { $regex: q} }).limit(10).exec()
						.then(topic_result => {
							User.find({ firstname: { $regex: q} }).select('firstname lastname image').limit(10).exec()
								.then(user_result => {
									res.writeHead(200, {
										'Content-Type': 'application/json'
									})
									const resp = {
										"status": 1,
										"msg": "Searched Successfully",
										"data": {
											question: question_result,
											topic: topic_result,
											user: user_result,
											answer: answer_result
										}
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


module.exports = router;
