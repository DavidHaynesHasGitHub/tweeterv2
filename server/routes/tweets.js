"use strict";

const userHelper = require("../lib/util/user-helper")
const express = require('express');
const tweetsRoutes = express.Router();
const cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const app = express();

module.exports = function(DataHelpers) {

    //Gets the tweets in the database
    tweetsRoutes.get("/", function(req, res) {
      DataHelpers.getTweets((err, tweets) => {
        if (err) {
          res.status(500).json({
            error: err.message
          });
        } else {
          res.json(tweets);
        }
      });
    });

    tweetsRoutes.post("/", function(req, res) {
      console.log('posted tweet route');
      if (!req.body.text) {
        res.status(400).json({
          error: 'invalid request: no data in POST body'
        });
        return;
      }
      const user = req.body.email ? req.body.email : userHelper.generateRandomUser();
      const tweet = {
        user: user,
        content: {
          text: req.body.text
        },
        created_at: Date.now(),
        likes: 0
      };
      console.log("going to save tweet to db")
      DataHelpers.saveTweet(tweet, (err) => {
        if (err) {
          res.status(500).json({
            error: err.message
          });
        } else {
          console.log("saving tweet")
          res.status(201).send();
        }
      });
    });

    tweetsRoutes.post("/register", function(req, res) {
      console.log("register route", req.body);
      let newID = generateRandomString();
      let newUser = {};
      const password = req.body.password
      newUser = {
        id: newID,
        email: req.body.email,
        password: password
      };
      console.log(newUser);
      req.session.userID = newID
      console.log(req.session.userID);
      DataHelpers.saveUser(newUser, (err) => {
        if (err) {
          res.status(500).json({
            error: err.message
          });
        } else {
          console.log("saving user")
          res.redirect('/')
        }
      })
    });

    tweetsRoutes.post("/login", function(req, res) {
      console.log("log in route", req.body.email);

      let attemptLogin;
       let keyForUserInfo;
       let flag = false;

      DataHelpers.getUsers((err, users) => {
        if (err) {
          res.status(500).json({
            error: err.message
          });
        } else {
          for (let userObject in users) {
            let user = users[userObject];
            let userEmail = user.email
            if(userEmail === req.body.email){
              console.log("found email")
             attemptLogin = user
             flag = true;
             break
            }
          }
          if(!flag){
            console.log('login failed')
          } else if ( req.body.password !== attemptLogin.password){
            console.log('wrong password')
          } else {
            console.log('success')
            req.session.userID = attemptLogin.id
          }
        }
      })
    })

    tweetsRoutes.get('/allowed', function (req, res) {
      console.log("in allowed route");
      if (req.session.userID) {
        res.json({
          status: true
        });
      } else {
        res.json({
          status: false
        });
      }
    })

    //When the user logs out, we clear the session
    tweetsRoutes.get("/logout", function(req, res) {
      console.log('in logout route');
      req.session = null;
      res.redirect('/')
    })

    //generates random number for hash generator
    function generateRandomString() {
      let randNum = Math.floor(Math.random() * 6969696969).toString();
      return randNum.hashCode();
    };

    //generates hash code with the input provided by the RNG above
    String.prototype.hashCode = function() {
      var hash = 0,
        i, chr;
      if (this.length === 0) return hash;
      for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash.toString(32);
    };


    return tweetsRoutes;

}
