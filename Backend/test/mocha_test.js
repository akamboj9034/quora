var assert = require('chai').assert;
var app = require('../app');
var chai = require('chai');
chai.use(require('chai-http'));
var expect = require('chai').expect;
var request = require('request');
var express = require('express');
var http = require("http");

var agent = require('chai').request.agent(app);

describe('GET topic', function(){

    it('GET /topic',function(){
        agent.get('/topic')
            .then(function(res){
                expect(res.status).to.equal(200);
            });
    });
})

describe('GET user', function(){

    it('GET /user/user_id',function(){
        agent.get('/user/5cb8d480c8697f7f386f8fe3')
            .then(function(res){
                expect(res.status).to.equal(200);
            });
    });
})

describe('GET user home', function(){

    it('GET /user/user_id/home',function(){
        agent.get('/user/5cb8d480c8697f7f386f8fe3/home')
            .then(function(res){
                expect(res.status).to.equal(200);
            });
    });
})

describe('GET user count', function(){

    it('GET /user/user_id/count',function(){
        agent.get('/user/5cb8d480c8697f7f386f8fe3/count')
            .then(function(res){
                expect(res.status).to.equal(200);
            });
    });
})

describe('GET user answers', function(){

    it('GET /user/user_id/answers',function(){
        agent.get('/user/5cb8d480c8697f7f386f8fe3/answers')
            .then(function(res){
                expect(res.status).to.equal(200);
            });
    });
})

describe('GET user questions', function(){

    it('GET /user/user_id/questions',function(){
        agent.get('/user/5cb8d480c8697f7f386f8fe3/questions')
            .then(function(res){
                expect(res.status).to.equal(200);
            });
    });
})

describe('GET user followers', function(){

    it('GET /user/user_id/followers',function(){
        agent.get('/user/5cb8d480c8697f7f386f8fe3/followers')
            .then(function(res){
                expect(res.status).to.equal(200);
            });
    });
})

describe('GET user following', function(){

    it('GET /user/user_id/following',function(){
        agent.get('/user/5cb8d480c8697f7f386f8fe3/following')
            .then(function(res){
                expect(res.status).to.equal(200);
            });
    });
})

describe('GET user bookmarked_answers', function(){

    it('GET /user/user_id/bookmarked_answers',function(){
        agent.get('/user/5cb8d480c8697f7f386f8fe3/bookmarked_answers')
            .then(function(res){
                expect(res.status).to.equal(200);
            });
    });
})

describe('GET user conversations', function(){

    it('GET /user/user_id/conversations',function(){
        agent.get('/user/5cb8d480c8697f7f386f8fe3/conversations')
            .then(function(res){
                expect(res.status).to.equal(200);
            });
    });
})

describe('GET user activity', function(){

    it('GET /user/user_id/activity',function(){
        agent.get('/user/5cb8d480c8697f7f386f8fe3/activity')
            .then(function(res){
                expect(res.status).to.equal(200);
            });
    });
})

describe('GET user answer_stats', function(){

    it('GET /user/user_id/answer_stats',function(){
        agent.get('/user/5cb8d480c8697f7f386f8fe3/answer_stats')
            .then(function(res){
                expect(res.status).to.equal(200);
            });
    });
})

describe('GET user upvote_stats', function(){

    it('GET /user/user_id/upvote_stats',function(){
        agent.get('/user/5cb8d480c8697f7f386f8fe3/upvote_stats')
            .then(function(res){
                expect(res.status).to.equal(200);
            });
    });
})

describe('GET user downvote_stats', function(){

    it('GET /user/user_id/downvote_stats',function(){
        agent.get('/user/5cb8d480c8697f7f386f8fe3/downvote_stats')
            .then(function(res){
                expect(res.status).to.equal(200);
            });
    });
})

describe('GET user bookmark_stats', function(){

    it('GET /user/user_id/bookmark_stats',function(){
        agent.get('/user/5cb8d480c8697f7f386f8fe3/bookmark_stats')
            .then(function(res){
                expect(res.status).to.equal(200);
            });
    });
})

describe('GET user profile_stats', function(){

    it('GET /user/user_id/profile_stats',function(){
        agent.get('/user/5cb8d480c8697f7f386f8fe3/profile_stats')
            .then(function(res){
                expect(res.status).to.equal(200);
            });
    });
})

// describe('User profile', function () {

//     it('get /user/userid', function (done) {
//         request.get('http://localhost:3001/user?5cb8d480c8697f7f386f8fe3', {
//             form: {
//                 user_id: "5cb8d480c8697f7f386f8fe3"
//             }
//         }, function (error, response, body) {
//             console.log("reponxes::::::", response)
//             assert.equal(400, response.statusCode);
//             done();
//         });
//     });
// });

//     it('POST /question', function () {
//         agent.post('allStudentsRegistered')
//             .send({
//                 course_id: 273
//             })
//             .then(function (res) {
//                 assert.equal(res.status, 200);
//             });
//     });
// });
// // describe('view courses', function() {

// //     it('Get /courses', function(done) {
// //         request.get('http://localhost:3001/course?next', {
// //             form : {
// //                 facultyid : 2012
// //             }
// //         }, function(error, response, body) {
// //             assert.equal(200, response.statusCode);
// //             done();
// //         });
// //     });
// // });

// // describe('view course information', function() {

// //     it('Get /courses/:id/information/:page', function(done) {
// //         request.get('http://localhost:3001/course?next', {
// //             form : {
// //                 facultyid : 2012
// //             }
// //         }, function(error, response, body) {
// //             assert.equal(200, response.statusCode);
// //             done();
// //         });
// //     });
// // });

// // describe('view assignment info', function() {

// //     it('Get /courses/:id/assignment/:page', function(done) {
// //         request.get('http://localhost:3001/course?786/assignment?next', {
// //             form : {
// //                 courseid : 786
// //             }
// //         }, function(error, response, body) {
// //             assert.equal(200, response.statusCode);
// //             done();
// //         });
// //     });
// // });

// // describe('view announcement info', function() {

// //     it('Get /courses/:id/announcement/:page', function(done) {
// //         request.get('http://localhost:3001/course?786/announcement?next', {
// //             form : {
// //                 courseid : 786
// //             }
// //         }, function(error, response, body) {
// //             assert.equal(200, response.statusCode);
// //             done();
// //         });
// //     });
// // });

// var chai = require('chai');
// var chaiHttp = require('chai-http');
// var should = require('chai').should();
// // var request = require('request');
// //import {ROOT_URL} from '../constants/constants';

// var expect = chai.expect;

// chai.use(chaiHttp);

// it("Get /topic", function (done) {
//     chai.request('http://localhost:3001')
//         .get('/topic')
//         .end(function (err, res) {
//             should.not.exist(err)
//             should.exist(res.body);
//             done();
//         });
// })