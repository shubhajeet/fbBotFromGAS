/*

  SETTING UP:
follow https://developers.facebook.com/docs/messenger-platform/quickstart but to get your webhook URL: go to the cloud icon (5th from the left) and make sure at the bottom "Who has access to the app:" = "Anyone, even anonymous", then press "DEPLOY" and use the resulting url
*/
//MAKE SURE EACH TIME UPDATE: GO TO THE CLOUD ICON (5th icon from the left), click "Project Version"->"New" and click the Update Button
function Bot(ACCESS_TOKEN,VERIFICATION_TOKEN,SPREADSHEET_ID)
{
    this.ACCESS_TOKEN = ACCESS_TOKEN;
    this.VERIFICATION_TOKEN = VERIFICATION_TOKEN;
    this.SPREADSHEET_ID = SPREADSHEET_ID;
    this.app = [{"func":this.processMessageEvent}];
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
              let response = pageEntry.messaging.forEach(messagingEvent => this.processMessageEvent(messagingEvent));
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
    var senderID = messageEvent.sender.id;
    var recipientID = messageEvent.recipient.id;
    var timeOfMessage = messageEvent.timestamp;
    var message = messageEvent.message;
    var messageId = message.mid;
    var messageText = message.text;
    var messageAttachments = message.attachments;
    //Logger.log(messageEvent);
    //Logger.log(message);
    Logger.log(messageText);
    this.sendTextMessage(senderID,messageText);
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
