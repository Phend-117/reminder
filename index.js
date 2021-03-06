// dependencies
const IncomingWebhook = require('@slack/client').IncomingWebhook;
const YAML = require('yamljs');
const Path = require('path');
const Fs = require('fs');


// slack
const URL = process.env.SLACK_WEBHOOK_URL || '';
const Webhook = new IncomingWebhook( URL );
const messagesPath = Path.normalize(`${ __dirname }/messages.yml`);


// culture messages
let culture = Fs.readFileSync( messagesPath, 'utf8' );
culture = YAML.parse( culture );

culture.today ++;
if( culture.today >= culture.messages.length ) {
	culture.today = 0;
}

const message = culture.messages[ culture.today ];


// post webhook
Webhook.send( `Today's culture value message:\n\n*${ message }*`, ( error, header, statusCode, body ) => {
	if( error ) {
		console.error( `error: `, err );
	}
	else {
		console.log(`received: ${ statusCode }`);
		console.log(`posted: ${ message }`);
		console.log(`index: ${ culture.today }`);

		// increment message index
		Fs.writeFileSync( messagesPath, YAML.stringify( culture, 2, 2 ), 'utf8');
	}
});
