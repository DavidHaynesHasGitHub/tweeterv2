"use strict";

var ObjectId = require('mongodb').ObjectID;

module.exports = function makeDataHelpers(db) {
  return {


    // Saves a tweet to `db`
    saveTweet: function (newTweet, callback) {
      if (!newTweet) return;
      db.collection("tweets").insertOne(newTweet);
      callback(null, true);
    },


    // Get all tweets in `db`, sorted by newest first
    getTweets: function (callback) {
      db.collection("tweets").find().toArray((err, tweets) => {
        if (err) {
          return callback(err, null);
        }
        tweets.sort((a, b) => {
          return b.created_at - a.created_at;
        });
        callback(null, tweets);
      });

    },

    //Find the tweet to update with the specified ID and set its likes to value
    //passed to the function
    updateLikes: function (id, likes, callback) {
      db.collection("tweets").update({
        "_id": ObjectId(id)
      }, {
        $set: {
          likes: likes
        }
      });

      db.collection("tweets").find({
        "_id": ObjectId(id)
      }).toArray((err, tweets) => {
        console.log(tweets);
      });
      callback(null);
    },

    // Saves a tweet to `db`
    saveUser: function (newUser, callback) {
      if (!newUser) return;
      db.collection("users").insertOne(newUser);
      callback(null, true);
    },

    getUsers: function (callback) {
      db.collection("users").find().toArray((err, users) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, users);
        }
      });
    }

  };
};
