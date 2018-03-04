$(document).ready(function() {
   $(".button-collapse").sideNav();
   //
   $("#tweet").hide();
   $('.loginreg').hide();

   $("#loginregbtn").click(function() {
     $(".loginreg").slideToggle();
   })

   //click event for slide toggle
   $("#compose").click(function() {
     $.get('/tweets/allowed/', function (status) {
        if (status.status) {
           $("#tweet").slideToggle();
           //focus on input text
           $("#tweet .textarea1").focus();
         } else {
           $.flash("Login first")
         }
       })
     })

   $("#mobile-demo").click(function() {
     $("#tweet").slideToggle();
     //focus on input text
     $("#tweet .textarea1").focus();

   });

   $("#tweet form").on('submit', function(e) {
     e.preventDefault()

     let tweetBody = $('#textarea1').val();
     $("#textarea1").val("")
     postNewTweet(tweetBody);
    });
    const postNewTweet = function(tweetBody) {
      let tweetText = {
        text: tweetBody
      };
      console.log('about to post', tweetText.text)
      $.post("/tweets", tweetText, loadTweets)
    };
    //stages the tweets to be rendered after clearing the
   const loadTweets = function() {
     $.get("/tweets", renderTweets);
   };

    // RENDERS THE TWEET OBJECTS
    const renderTweets = function(data) {
        var source= $("#tweetTemplate").html()
        Handlebars.registerHelper('reverse', function (arr) {
            arr.reverse();
        });

        var template = Handlebars.compile(source);
        var html = template(data);
        $("#tweetFeed").html(html);
      }

    loadTweets()
});
