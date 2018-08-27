var slacker = require ("./slacker");
var AWS = require('aws-sdk');
var serialize = require('node_modules/node-serialize');

AWS.config.update({region: 'us-east-1'});

exports.handler = (event, context, callback) => {
  
    var data = {};
    if (event.body != null && event.body != undefined) {
      data = serialize.unserialize(event.body);
    }
    else {
      data = serialize.unserialize(JSON.stringify(event));
    }
    var theUsername = data.username;
    var theIconUrl = data.icon;
    var theText = data.text;
    var urlWebHook = process.env.WEBHOOK;
    var webhook = urlWebHook.substring(32, urlWebHook.length);
    
    var post = slacker.SendToSlack(theText, webhook, theUsername, theIconUrl);
    if (post > 0) {
        var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});
        var params = {
          TableName: process.env.DYNAMODB_TABLE,
          Item: {
            'username' : {S: theUsername},
            'timestamp' : {N: post.toString()},
            'text' : {S: theText}
          }
        };
        
        // Call DynamoDB to add the item to the table
        ddb.putItem(params, function(err, data) {
          if (err) {
            console.log("Error", err);
          } else {
            const response = {
              statusCode: 200,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({'status': 'ok'}),
            };
            callback(null, response);
          }
        });   
    }
};
