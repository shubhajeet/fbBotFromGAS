/*

  SETTING UP:
  follow https://developers.facebook.com/docs/messenger-platform/quickstart but to get your webhook URL: go to the cloud icon (5th from the left) and make sure at the bottom "Who has access to the app:" = "Anyone, even anonymous", then press "DEPLOY" and use the resulting url
*/
//MAKE SURE EACH TIME UPDATE: GO TO THE CLOUD ICON (5th icon from the left), click "Project Version"->"New" and click the Update Button
function Bot(ACCESS_TOKEN,VERIFICATION_TOKEN)
{
    this.ACCESS_TOKEN = ACCESS_TOKEN;
    this.VERIFICATION_TOKEN = VERIFICATION_TOKEN;
    this.app = [];
}

Bot.prototype.verify = function (request) {
    Logger.log("gotrequest " + JSON.stringify(request)); 
    if(request.parameters["hub.verify_token"] == this.VERIFICATION_TOKEN){
        return ContentService.createTextOutput(request.parameters["hub.challenge"][0]);
    }
    return ContentService.createTextOutput(JSON.stringify(request)).setMimeType(ContentService.MimeType.JSON);
}

Bot.prototype.response =  function(request){
    try
    {
        var data = JSON.parse(request.postData.contents);
        // Make sure this is a page subscription
        if (data.object == 'page')
        {
            Logger.log("Valid page detected "+request.postData.contents);
            data.entry.forEach(pageEntry => {
                var pageID = pageEntry.id;
                var timeOfEvent = pageEntry.time;
                let response = pageEntry.messaging.forEach(messagingEvent => {
                    for (let i = 0; i < this.app.length; i++ )
                    {
                        match = this.app[i].criteria(messagingEvent,pageID,timeOfEvent);
                        if (match)
                        {
                            if (!this.app[i].func(messagingEvent,match) )
                            {
                                break;
                            }
                        }
                    }
                }
                                                          );
                return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);;
            });
        }
        else
        {
            Logger.log("dataObject not page");
            return ContentService.createTextOutput(JSON.stringify({"error":"object is not page"})).setMimeType(ContentService.MimeType.JSON);;

        }
    }
    catch(e)
    {
        Logger.log("error "+e.name+e.message+JSON.stringify(e));
        return ContentService.createTextOutput(JSON.stringify({"error":e})).setMimeType(ContentService.MimeType.JSON);;

    }
}

Bot.prototype.processMessageEvent = function(messageEvent) {
    /*
      var senderID = messageEvent.sender.id;
      var recipientID = messageEvent.recipient.id;
      var timeOfMessage = messageEvent.timestamp;
      var message = messageEvent.message;
      var messageId = message.mid;
      var messageText = message.text;
      var messageAttachments = message.attachments;
      //Logger.log(messageEvent);
      //Logger.log(message);*/

    this.sendTextMessage(senderID,messageText);
}

Bot.prototype.addResponse = function(func,criteria)
{
    this.app.push({"func":func,"criteria":criteria});
}

Bot.prototype.sendTextMessage = function(recipientId, messageText, type="RESPONSE") {
    var messageData = {
        "messaging_type": type,
        "recipient":{
            "id": recipientId
        },
        "message":{
            "text": messageText
        }};
    return this.callSendAPI(messageData);
}
/*
 * @param recipientId id of recepient
 * @param message json containing the message
 * @param type could be RESPONSE UPDATE MESSAGE_TAG
 *
 */
Bot.prototype.sendMessage = function(recipientId, message,type="RESPONSE")
{
    var messageData = {
        "messaging_type": type,
        "recipient":{
            "id": recipientId
        },
        "message": message
    };
    return this.callSendAPI(messageData);
}


Bot.prototype.callSendAPI = function (messageData) {
    url = "https://graph.facebook.com/v7.0/me/messages?access_token=" +this.ACCESS_TOKEN;
    var options =
        {
            "method" : "post",
            "contentType" : "application/json",
            "payload" : JSON.stringify(messageData),      
        };
    return UrlFetchApp.fetch(url, options);  
}

Bot.prototype.testPayload = function(re)
{
    return messageEvent => { 
        if(messageEvent.message.quick_reply)
        {
            Logger.log("trying to match");
            let match = messageEvent.message.quick_reply.payload.match(re);
            Logger.log(match);
            return match;
        }
        else
        {
            return false;
        }
    };
}

Bot.prototype.testText = function(re)
{
    return messageEvent => { 
        return messageEvent.message.text.match(re);
    };
}

Bot.prototype.getProfile = function(psid,fields=["id","name","first_name","last_name","profile_pic","locale","timezone","gender"])
{
    let fieldstr = fields.join(",")
    let url = `https://graph.facebook.com/${psid}?&fields=${fieldstr}&access_token=${this.ACCESS_TOKEN}`;
    let response = UrlFetchApp.fetch(url);
    return response;
}
