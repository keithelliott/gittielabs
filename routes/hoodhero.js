/**
 * Created with JetBrains WebStorm.
 * User: keithelliott
 * Date: 5/23/13
 * Time: 10:07 PM
 * To change this template use File | Settings | File Templates.
 */
var twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

////Twilio goodness
//var config = {};
//
//if (process.env.TWILIO_ACCOUNT_SID) {
//    config.accountSid = process.env.TWILIO_ACCOUNT_SID;
//    config.authToken = process.env.TWILIO_AUTH_TOKEN;
//}

exports.voice = function(req, res){
    console.log('entering voice route');
    if (twilio.validateExpressRequest(req, config.authToken)) {
        var resp = new twilio.TwimlResponse();
        resp.say('Why hello sexy lady! Time for bed?');

        res.type('text/xml');
        res.send(resp.toString());
    }
    else {
        res.send('you are not twilio.  Buzz off.');
    }
};


exports.sms = function(req, res){
    //Loop through a list of SMS messages sent from a given number
    twilio.listSms({
        from:'+13025888072'
    }, function (err, responseData) {
        responseData.smsMessages.forEach(function(message) {
            console.log('Message sent on: '+message.dateCreated.toLocaleDateString());
            console.log(message.body);
        });
    });
};