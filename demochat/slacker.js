var https = require('https');

module.exports = {
	
	SendToSlack: function (theText, urlWebHook, theUsername, theIconUrl) {
		
		var slack_host = 'hooks.slack.com';
		var channel = 'protego-chat-demo';
		var payload = {
			text: theText
		};
		
		if (theUsername !== undefined) {
			payload.username = theUsername;
		}
		if (theIconUrl !== undefined) {
			payload.icon_url = theIconUrl;
		}
		
		payload.as_user = false;
		payload.channel = channel;
		var data = JSON.stringify(payload);

		var options = {
			hostname: slack_host,
			method: 'POST',
			path: '/services' + urlWebHook, 
			headers: {
			    'Content-Type': 'application/json',
			}
		};
	
		var req = https.request(options, (res) => {
			//console.log('statusCode:', res.statusCode);
			//console.log(data);
			res.on(data, (d) => {
				
				process.stdout.write(ts);
				
			});
		});
		
		req.on('error', (e) => {
			console.error(e);
		});
		
		req.write(data);
		req.end();
		var ts = new Date().getTime();
		return ts;
	}
};
