var assert = require('chai').assert;
var app = require('../index');
var chai = require('chai');
chai.use(require('chai-http'));
var expect = require('chai').expect;
var request = require('request');
var express = require('express');
var http = require("http");

describe('User profile', function() {

    it('Get /profile', function(done) {
        request.get('http://localhost:3001/course?next', {
            form : {
                facultyid : 2012
            }
        }, function(error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
    });
});

describe('view courses', function() {

    it('Get /courses', function(done) {
        request.get('http://localhost:3001/course?next', {
            form : {
                facultyid : 2012
            }
        }, function(error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
    });
});

describe('view course information', function() {

    it('Get /courses/:id/information/:page', function(done) {
        request.get('http://localhost:3001/course?next', {
            form : {
                facultyid : 2012
            }
        }, function(error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
    });
});

describe('view assignment info', function() {

    it('Get /courses/:id/assignment/:page', function(done) {
        request.get('http://localhost:3001/course?786/assignment?next', {
            form : {
                courseid : 786
            }
        }, function(error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
    });
});

describe('view announcement info', function() {

    it('Get /courses/:id/announcement/:page', function(done) {
        request.get('http://localhost:3001/course?786/announcement?next', {
            form : {
                courseid : 786
            }
        }, function(error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
    });
});