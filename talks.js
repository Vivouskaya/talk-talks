Talks = new Meteor.Collection("talks");

Meteor.saveMessage = function(content) {
    var username = content.username;
    var message = content.message;
    var votes = 0;

    if (!username || !message) {
      return;
    }
    Talks.insert({
      username: username,
      message: message,
      votes: votes,

      timestamp: Date.now()
    }, function(err, id) {
      if (err) {
        alert('Something definitely went wrong!');
      }
      if (id) {
        $('#newMessage').val('');
        $('#username').val('');
      }
    });
};

Meteor.deleteMessage = function(content) {

    

}


Meteor.methods({
  upvote: function (talkId) {
    var talk = Talks.findOne(talkId);
    Talks.update(
      talkId,
      {$set: {votes: talk.votes + 1}}
    );
  },

  downvote: function (talkId) {
    var talk = Talks.findOne(talkId);
    Talks.update(
      talkId,
      {$set: {votes: talk.votes - 1}}
    );
  }

});

if (Meteor.isServer) {

  Talks.allow({
    'insert': function(userId, doc) {
      return true;

    },
    'remove': function(userId, doc) {
      return true;
    }
    
  });

  Meteor.publish("talks", function () {
    return Talks.find();

  }); 

} 

else if (Meteor.isClient) {

  Meteor.subscribe("talks");

  Template.talksList.talks = function () {
    return Talks.find({}, { sort: { votes: -1}});
  };

  Template.talksList.events({
    "click .upvote": function () {
      Meteor.call("upvote", this._id);
    },
    "click .downvote": function () {
      Meteor.call("downvote", this._id);
    }
  });

  Template.newTalk.events({
    'click #send': function() {
      var message = $('#newMessage').val();
      var username = $('#username').val();
      
      if (!message || !username) {
        alert('ME PRENDS PAS POUR UN JAMBON !!!');
      }
      Meteor.saveMessage({
        message: message,
        username: username,
        votes: votes,

        
      });
    }
  });



  

}

